import { ChatroomApi } from '@data/user-api-axios/api'

import { queryKeys } from './query-keys'
import apiInstance from '../lib/api'
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
        const { data } = await this.getCurrentChatRoom1()
        return data?.data?.chatRoomState
      },
    }
  }

  // 채팅 메시지 목록 조회 (무한 스크롤용)
  chatMessagesQuery(chatId?: number) {
    return {
      queryKey: [...queryKeys.chat.messages(), chatId] as const,
      queryFn: async ({ pageParam = 0 }) => {
        const { data } = await this.getCurrentChatRoomMessages({
          pageable: {
            page: pageParam as number,
            size: 10,
            sort: [],
          },
        })
        return data?.data
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
        const { data } = await this.getCurrentChatRoom1()
        return data?.data
      },
    }
  }

  // === Mutation Options ===
  sendMessageMutation() {
    return {
      mutationFn: async (message: string) => {
        const { data } = await this.sendChatMessage1({ chatRequest: { message } })
        return data?.data
      },
      onError: () => {
        toast.error('메시지 전송 중 오류가 발생했습니다')
      },
    }
  }

  upgradeChatRoomMutation() {
    return {
      mutationFn: async () => {
        const { data } = await this.sendChatMessage()
        return data?.data
      },
      onError: () => {
        toast.error('채팅방 업그레이드 중 오류가 발생했습니다')
      },
    }
  }

  completeChatRoomMutation() {
    return {
      mutationFn: async () => {
        const { data } = await this.completeChatRoom()
        return data?.data
      },
      onError: () => {
        toast.error('채팅 완료 처리 중 오류가 발생했습니다')
      },
    }
  }
}

export default new ChatService()
