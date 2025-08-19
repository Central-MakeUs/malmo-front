import {
  BaseListSwaggerResponseChatRoomMessageData,
  ChatRoomMessageData,
  ChatRoomMessageDataSenderTypeEnum,
  ChatRoomStateDataChatRoomStateEnum,
} from '@data/user-api-axios/api'
import { useQuery, useMutation, useQueryClient, useInfiniteQuery, InfiniteData } from '@tanstack/react-query'

import { useChatting } from '@/features/chat/context/chatting-context' // ChattingContext를 import 합니다.
import chatService from '@/shared/services/chat.service'
import historyService from '@/shared/services/history.service'

export interface ChatMessageTempStatus {
  status: 'failed' | 'sent' | 'pending'
}

const CONNECTED_REQUIRED_MESSAGE =
  '알려줘서 고마워! 그런데, 본격적인 상담은 커플 연결이 완료된 후에 시작할 수 있어. 마이페이지에서 커플 코드를 연인에게 공유해봐!'

// === QUERIES ===
export const useChatRoomStatusQuery = () => {
  return useQuery(chatService.chatRoomStatusQuery())
}

// 채팅 메시지 목록 조회
export const useChatMessagesQuery = (
  enabled: boolean,
  chatStatus: ChatRoomStateDataChatRoomStateEnum | undefined,
  chatId?: number
) => {
  // chatId가 있으면 히스토리 메시지, 없으면 현재 채팅 메시지
  if (chatId) {
    return useInfiniteQuery({
      ...historyService.historyMessagesQuery(chatId),
    })
  }

  return useInfiniteQuery({
    ...chatService.chatMessagesQuery(),
    select: (data) => {
      if (chatStatus !== ChatRoomStateDataChatRoomStateEnum.Paused) return data

      const newData = JSON.parse(JSON.stringify(data)) as InfiniteData<BaseListSwaggerResponseChatRoomMessageData>

      const assistantMessage: ChatRoomMessageData = {
        messageId: Date.now(),
        content: CONNECTED_REQUIRED_MESSAGE,
        createdAt: new Date().toISOString(),
        senderType: ChatRoomMessageDataSenderTypeEnum.Assistant,
      }

      const firstPageList = newData.pages[0]?.list
      if (firstPageList?.some((msg) => msg.content === CONNECTED_REQUIRED_MESSAGE)) return newData

      newData.pages[0]?.list?.unshift(assistantMessage)

      return newData
    },
    enabled,
  })
}

// === MUTATIONS ===

// 메시지 전송
export const useSendMessageMutation = () => {
  const queryClient = useQueryClient()
  const queryKey = chatService.chatMessagesQuery().queryKey
  const { reconnectSSE } = useChatting()

  return useMutation({
    ...chatService.sendMessageMutation(),
    onMutate: async (newMessageText) => {
      await queryClient.cancelQueries({ queryKey })
      const previousMessages = queryClient.getQueryData(queryKey)

      const optimisticMessage: ChatRoomMessageData & ChatMessageTempStatus = {
        messageId: Date.now(),
        content: newMessageText,
        createdAt: new Date().toISOString(),
        senderType: ChatRoomMessageDataSenderTypeEnum.User,
        // 전송 상태를 나타내는 임시 필드 추가
        status: 'pending',
      }

      queryClient.setQueryData<InfiniteData<BaseListSwaggerResponseChatRoomMessageData>>(queryKey, (oldData) => {
        const newData = oldData ? { ...oldData, pages: [...oldData.pages] } : { pages: [], pageParams: [] }
        if (newData.pages.length > 0) {
          const firstPage = { ...newData.pages[0], list: [...(newData.pages[0]?.list ?? [])] }
          firstPage.list.unshift(optimisticMessage)
          newData.pages[0] = firstPage
        } else {
          newData.pages.push({
            list: [optimisticMessage],
            page: 0,
            size: 1,
            totalCount: 1,
          })
        }
        return newData
      })

      return { previousMessages, optimisticMessageId: optimisticMessage.messageId }
    },
    onSuccess: (data, variables, context) => {
      // 메시지 전송 성공 시 SSE 재연결
      reconnectSSE()

      // 낙관적 업데이트된 메시지의 상태를 'sent'로 변경
      queryClient.setQueryData<InfiniteData<BaseListSwaggerResponseChatRoomMessageData>>(queryKey, (oldData) => {
        if (!oldData) return oldData
        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            list: page.list?.map((msg) =>
              msg.messageId === context.optimisticMessageId ? { ...msg, status: 'sent' } : msg
            ),
          })),
        }
      })
    },
    onError: (err, newMessage, context) => {
      // 이전 메시지 상태로 복원하는 대신, 실패한 메시지 상태를 'failed'로 변경
      if (context?.optimisticMessageId) {
        queryClient.setQueryData<InfiniteData<BaseListSwaggerResponseChatRoomMessageData>>(queryKey, (oldData) => {
          if (!oldData) return oldData
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              list: page.list?.map((msg) =>
                msg.messageId === context.optimisticMessageId ? { ...msg, status: 'failed' } : msg
              ),
            })),
          }
        })
      }
      // TODO: 사용자에게 에러 토스트 메시지 등을 보여주는 로직 추가
      console.error('Message sending failed:', err)
    },
  })
}

// 채팅방 업그레이드
export const useUpgradeChatRoomMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    ...chatService.upgradeChatRoomMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatService.chatRoomStatusQuery().queryKey })
    },
  })
}
