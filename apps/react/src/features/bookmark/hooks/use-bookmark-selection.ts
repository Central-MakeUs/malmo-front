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

const normalizeMessageDate = (value?: string) => (value ? new Date(value).getTime() : 0)

const mergeMessages = (base: ChatRoomMessageData[], extra: ChatRoomMessageData[], ascending: boolean) => {
  const byId = new Map<number, ChatRoomMessageData>()
  base.forEach((message) => {
    if (message.messageId != null) byId.set(message.messageId, message)
  })
  extra.forEach((message) => {
    if (message.messageId != null) byId.set(message.messageId, message)
  })
  const merged = Array.from(byId.values())
  merged.sort((a, b) => {
    const diff = normalizeMessageDate(a.createdAt) - normalizeMessageDate(b.createdAt)
    return ascending ? diff : -diff
  })
  return merged
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
          sort: 'ASC',
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
        bookmarkId: message.bookmarkId,
      }))

      const pageData: BaseListSwaggerResponseChatRoomMessageData = {
        page: result?.page ?? 0,
        size: result?.size ?? mappedMessages.length,
        totalCount: mappedMessages.length,
        list: mappedMessages,
      }

      const targetQueryKey = chatId
        ? historyService.historyMessagesQuery(chatId).queryKey
        : chatService.chatMessagesQuery(targetChatRoomId).queryKey

      queryClient.setQueryData(targetQueryKey, (oldData: any) => {
        if (!oldData || !oldData.pages) {
          return {
            pages: [
              {
                ...pageData,
                page: 0,
                totalCount: mappedMessages.length + 1,
              },
            ],
            pageParams: [0],
          }
        }

        const firstPage = oldData.pages[0] ?? {}
        const mergedList = mergeMessages(firstPage.list ?? [], mappedMessages, true)
        const nextPage = {
          ...firstPage,
          list: mergedList,
          page: firstPage.page ?? 0,
          size: firstPage.size ?? mergedList.length,
          totalCount: firstPage.totalCount ?? oldData.pages[0]?.totalCount ?? mergedList.length,
        }

        return {
          ...oldData,
          pages: [nextPage, ...oldData.pages.slice(1)],
        }
      })
      onSelectComplete?.(result?.targetMessageId)
    },
    [chatId, fetchBookmarkMessages, isPending, onSelectComplete, queryClient]
  )

  return { handleSelectBookmark, isLoadingBookmarkMessages: isPending }
}
