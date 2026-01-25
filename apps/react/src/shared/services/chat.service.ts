import { ChatroomApi } from '@data/user-api-axios/api'

import { queryKeys } from './query-keys'
import apiInstance from '../lib/api'
import { CHAT_ROOM_STATE, ChatRoomListItem } from '../types/chat'
import { toast } from '../ui/toast'
class ChatService extends ChatroomApi {
  constructor() {
    super(undefined, '', apiInstance)
  }

  // === Query Options ===
  chatRoomStatusQuery() {
    return {
      queryKey: queryKeys.chat.status(),
      queryFn: async () => {
        const { data } = await this.getChatRoomList({
          pageable: { page: 0, size: 50, sort: ['lastMessageSentTime,desc', 'createdAt,desc'] },
        })
        const list = (data?.data?.list ?? []) as ChatRoomListItem[]
        const activeRooms = list.filter((room) => room.chatRoomState === CHAT_ROOM_STATE.Alive)
        if (activeRooms.length === 0) return null
        const getTimestamp = (room: ChatRoomListItem) =>
          new Date(room.lastMessageSentTime ?? room.createdAt ?? 0).getTime()
        return [...activeRooms].sort((a, b) => getTimestamp(b) - getTimestamp(a))[0] ?? null
      },
    }
  }

  // 채팅 메시지 목록 조회 (무한 스크롤용)
  chatMessagesQuery(chatRoomId: number) {
    return {
      queryKey: [...queryKeys.chat.messages(), chatRoomId] as const,
      queryFn: async ({ pageParam = 0 }) => {
        const { data } = await this.getChatRoomMessages({
          pageable: {
            page: pageParam as number,
            size: 10,
            sort: [],
          },
          chatRoomId,
        })
        const payload = data?.data
        if (!payload?.list) return payload
        return {
          ...payload,
          list: payload.list.map((message) => ({
            ...message,
            bookmarkId: message.bookmarkId,
          })),
        }
      },
      initialPageParam: 0,
      getNextPageParam: (lastPage: any, allPages: any[]) => {
        const totalCount = lastPage?.totalCount ?? 0
        const fetchedMessagesCount = allPages.reduce((acc, page) => acc + (page.list?.length || 0), 0)

        if (fetchedMessagesCount >= totalCount) {
          return undefined
        }

        return allPages.length
      },
    }
  }

  // 채팅방 요약 조회
  chatSummaryQuery(chatRoomId: number) {
    return {
      queryKey: queryKeys.chat.summary(chatRoomId),
      queryFn: async () => {
        const { data } = await this.getCurrentChatRoom({ chatRoomId })
        return data?.data
      },
    }
  }

  // === Mutation Options ===
  sendMessageMutation() {
    return {
      mutationFn: async (params: { chatRoomId: number; message: string }) => {
        const { data } = await this.sendMessage({
          chatRoomId: params.chatRoomId,
          sendMessageRequest: { message: params.message },
        })
        return data?.data
      },
      onError: () => {
        toast.error('메시지 전송 중 오류가 발생했습니다')
      },
    }
  }

  createChatRoomMutation() {
    return {
      mutationFn: async () => {
        const { data } = await this.createChatRoom()
        return data?.data
      },
      onError: () => {
        toast.error('채팅방 생성 중 오류가 발생했습니다')
      },
    }
  }

  upgradeChatRoomMutation() {
    return {
      mutationFn: async () => {
        // const { data } = await this.sendChatMessage()
        // return data?.data
        return null
      },
      onError: () => {
        toast.error('채팅방 업그레이드 중 오류가 발생했습니다')
      },
    }
  }
}

export default new ChatService()
