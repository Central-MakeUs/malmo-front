import {
  BaseListSwaggerResponseChatRoomMessageData,
  ChatRoomMessageData,
  ChatRoomMessageDataSenderTypeEnum,
} from '@data/user-api-axios/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'

import bookmarkService from '@/shared/services/bookmark.service'
import chatService from '@/shared/services/chat.service'
import historyService from '@/shared/services/history.service'

type UseBookmarkSelectionOptions = {
  chatId?: number
  onSelectComplete?: (targetMessageId?: number) => void
}

export function useBookmarkSelection({ chatId, onSelectComplete }: UseBookmarkSelectionOptions) {
  const queryClient = useQueryClient()
  const { mutateAsync: fetchBookmarkMessages, isPending } = useMutation(bookmarkService.bookmarkMessagesMutation())

  const handleSelectBookmark = useCallback(
    async (bookmarkId: number, targetChatRoomId: number) => {
      if (isPending) return
      let result
      try {
        result = await fetchBookmarkMessages({
          chatRoomId: targetChatRoomId,
          bookmarkId,
          size: 20,
          sort: chatId ? 'ASC' : 'DESC',
        })
      } catch {
        return
      }

      const messageList = result?.messages ?? []
      if (messageList.length === 0) return

      const mappedMessages: ChatRoomMessageData[] = messageList.map((message) => ({
        messageId: message.messageId,
        content: message.content,
        senderType: message.senderType as ChatRoomMessageDataSenderTypeEnum | undefined,
        createdAt: message.createdAt,
        saved: message.isSaved,
      }))

      const pageData: BaseListSwaggerResponseChatRoomMessageData = {
        page: result?.page ?? 0,
        size: result?.size ?? mappedMessages.length,
        totalCount: mappedMessages.length,
        list: mappedMessages,
      }

      const targetQueryKey = chatId
        ? historyService.historyMessagesQuery(chatId).queryKey
        : chatService.chatMessagesQuery().queryKey

      queryClient.setQueryData(targetQueryKey, { pages: [pageData], pageParams: [0] })
      onSelectComplete?.(result?.targetMessageId)
    },
    [chatId, fetchBookmarkMessages, isPending, onSelectComplete, queryClient]
  )

  return { handleSelectBookmark, isLoadingBookmarkMessages: isPending }
}
