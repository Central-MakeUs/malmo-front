import {
  ChatRoomMessageData,
  ChatRoomMessageDataSenderTypeEnum,
  BaseListSwaggerResponseChatRoomMessageData,
} from '@data/user-api-axios/api'
import { useQuery, useMutation, useQueryClient, useInfiniteQuery, InfiniteData } from '@tanstack/react-query'

import chatService from '@/shared/services/chat.service'
import { queryKeys } from '@/shared/services/query-keys'

export interface ChatMessageTempStatus {
  status?: 'failed' | 'sent' | 'pending' | 'queued'
}

const isAscending = (list?: ChatRoomMessageData[]) => {
  if (!list || list.length < 2) return true
  const firstItem = list[0]
  const lastItem = list[list.length - 1]
  const first = firstItem?.createdAt ? new Date(firstItem.createdAt).getTime() : 0
  const last = lastItem?.createdAt ? new Date(lastItem.createdAt).getTime() : 0
  return first <= last
}
const getTargetPageIndex = (pages: Array<{ list?: ChatRoomMessageData[] }>) => {
  if (pages.length === 0) return 0
  const ascending = isAscending(pages[0]?.list)
  return ascending ? pages.length - 1 : 0
}

export const useChatRoomStatusQuery = () => {
  return useQuery({
    ...chatService.chatRoomStatusQuery(),
  })
}

export const useCurrentChatRoomQuery = (enabled = true) => {
  return useQuery({
    ...chatService.chatRoomStatusQuery(),
    enabled,
  })
}

export const useChatMessagesQuery = (options: { enabled: boolean; chatRoomId?: number }) => {
  const { enabled, chatRoomId } = options

  return useInfiniteQuery({
    ...chatService.chatMessagesQuery(chatRoomId ?? 0),
    enabled: enabled && !!chatRoomId,
  })
}

// === MUTATIONS ===

// 메시지 전송

export const useSendMessageMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    ...chatService.sendMessageMutation(),
    onMutate: async (params) => {
      const queryKey = chatService.chatMessagesQuery(params.chatRoomId).queryKey
      await queryClient.cancelQueries({ queryKey })
      const previousMessages = queryClient.getQueryData(queryKey)
      const optimisticMessage: ChatRoomMessageData & ChatMessageTempStatus = {
        messageId: Date.now(),
        content: params.message,
        createdAt: new Date().toISOString(),
        senderType: ChatRoomMessageDataSenderTypeEnum.User,
        status: 'pending',
      }

      queryClient.setQueryData<InfiniteData<BaseListSwaggerResponseChatRoomMessageData>>(queryKey, (oldData) => {
        const newData = oldData ? { ...oldData, pages: [...oldData.pages] } : { pages: [], pageParams: [] }

        if (newData.pages.length > 0) {
          const targetIndex = getTargetPageIndex(newData.pages)
          const targetPage = { ...newData.pages[targetIndex], list: [...(newData.pages[targetIndex]?.list ?? [])] }
          if (isAscending(targetPage.list)) {
            targetPage.list.push(optimisticMessage)
          } else {
            targetPage.list.unshift(optimisticMessage)
          }
          newData.pages[targetIndex] = targetPage
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

      return {
        previousMessages,
        optimisticMessageId: optimisticMessage.messageId,
        chatRoomId: params.chatRoomId,
      }
    },

    onSuccess: (data, variables, context) => {
      if (!context?.chatRoomId) return
      const queryKey = chatService.chatMessagesQuery(context.chatRoomId).queryKey
      const resolvedMessageId = data?.messageId
      queryClient.setQueryData<InfiniteData<BaseListSwaggerResponseChatRoomMessageData>>(queryKey, (oldData) => {
        if (!oldData) return oldData
        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            list: page.list?.map((msg) =>
              msg.messageId === context.optimisticMessageId
                ? { ...msg, status: 'sent', messageId: resolvedMessageId ?? msg.messageId }
                : msg
            ),
          })),
        }
      })
      queryClient.invalidateQueries({ queryKey: queryKeys.history.all })
    },

    onError: (err, newMessage, context) => {
      // 이전 메시지 상태로 복원하는 대신, 실패한 메시지 상태를 'failed'로 변경

      if (context?.optimisticMessageId && context.chatRoomId) {
        const queryKey = chatService.chatMessagesQuery(context.chatRoomId).queryKey
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

      console.error('Message sending failed:', err)
    },
  })
}

// 채팅방 업그레이드

export const useUpgradeChatRoomMutation = (options?: { onSuccess?: () => void; onError?: () => void }) => {
  const queryClient = useQueryClient()
  return useMutation({
    ...chatService.upgradeChatRoomMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatService.chatRoomStatusQuery().queryKey })
      options?.onSuccess?.()
    },
    onError: () => {
      options?.onError?.()
    },
  })
}
