import { useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useLayoutEffect, useMemo, useState, useEffect } from 'react'
import { z } from 'zod'

import { BookmarkSheet, useBookmarkSelection } from '@/features/bookmark'
import { useChatting } from '@/features/chat/context/chatting-context'
import { useChatMessagesQuery, useCurrentChatRoomQuery } from '@/features/chat/hooks/use-chat-queries'
import { useChatScroll } from '@/features/chat/hooks/use-chat-scroll'
import { useScrollToBottom } from '@/features/chat/hooks/use-scroll-to-bottom'
import { ChatFloatingActions } from '@/features/chat/ui/chat-floating-actions'
import ChatInput from '@/features/chat/ui/chat-input'
import { ChatMessageList } from '@/features/chat/ui/chat-message-list'
import { wrapWithTracking } from '@/shared/analytics'
import { BUTTON_NAMES, CATEGORIES } from '@/shared/analytics/constants'
import { useInfiniteScroll } from '@/shared/hooks/use-infinite-scroll'
import { Screen } from '@/shared/layout/screen'
import { useGoBack } from '@/shared/navigation/use-go-back'
import { queryKeys } from '@/shared/services/query-keys'
import { DetailHeaderBar } from '@/shared/ui/header-bar'

const searchSchema = z.object({
  chatId: z.number().optional(),
  fromHistory: z.boolean().optional(),
  title: z.string().optional(),
})

export const Route = createFileRoute('/chat/')({
  component: RouteComponent,
  validateSearch: searchSchema,
})

function RouteComponent() {
  const { chatId, title: chatTitle } = Route.useSearch()
  const goBack = useGoBack()
  const queryClient = useQueryClient()
  const {
    streamingMessage,
    streamingChatRoomId,
    awaitingResponse,
    sendingMessage,
    sendMessageWithReconnect,
    setActiveChatRoomId,
  } = useChatting()
  const [isBookmarkSheetOpen, setIsBookmarkSheetOpen] = useState(false)

  const { data: currentChatRoom } = useCurrentChatRoomQuery(!chatId)
  const resolvedChatRoomId = chatId ?? currentChatRoom?.chatRoomId
  const headerTitle = chatId ? (chatTitle ?? '') : (currentChatRoom?.title ?? '')

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useChatMessagesQuery({
    enabled: true,
    chatRoomId: resolvedChatRoomId,
  })

  const { ref } = useInfiniteScroll({ hasNextPage, isFetchingNextPage, fetchNextPage })
  const [pendingScrollMessageId, setPendingScrollMessageId] = useState<number | null>(null)

  const messages = useMemo(() => {
    if (!data) return []
    const allMessages = data.pages.flatMap((page) => page?.list ?? [])
    return [...allMessages].sort((a, b) => {
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0
      if (aTime !== bTime) return aTime - bTime
      const aId = a.messageId ?? 0
      const bId = b.messageId ?? 0
      return aId - bId
    })
  }, [data, chatId])

  const isStreamingForThisChat = !!resolvedChatRoomId && streamingChatRoomId === resolvedChatRoomId

  const scrollRef = useChatScroll({
    chatId,
    isFetchingNextPage,
    sendingMessage: isStreamingForThisChat ? sendingMessage : false,
    messages,
    streamingMessage: isStreamingForThisChat ? streamingMessage : null,
    awaitingResponse: isStreamingForThisChat ? awaitingResponse : false,
  })

  const { isAtBottom, scrollToBottom } = useScrollToBottom({
    scrollRef,
    deps: [messages.length, streamingMessage?.content],
  })

  useEffect(() => {
    return () => {
      if (!resolvedChatRoomId) return
      queryClient.invalidateQueries({
        queryKey: [...queryKeys.chat.messages(), resolvedChatRoomId],
      })
    }
  }, [queryClient, resolvedChatRoomId])

  useLayoutEffect(() => {
    if (resolvedChatRoomId) {
      setActiveChatRoomId(resolvedChatRoomId)
    }
  }, [resolvedChatRoomId, setActiveChatRoomId])

  const { handleSelectBookmark } = useBookmarkSelection({
    onSelectComplete: (targetMessageId) => {
      setPendingScrollMessageId(targetMessageId ?? null)
      setIsBookmarkSheetOpen(false)
    },
  })

  const handleRetry = wrapWithTracking(BUTTON_NAMES.RETRY_MESSAGE, CATEGORIES.CHAT, (content: string) => {
    if (!resolvedChatRoomId) return
    void sendMessageWithReconnect(content, resolvedChatRoomId)
  })

  useLayoutEffect(() => {
    if (!scrollRef.current) return
    const raf = requestAnimationFrame(() => {
      const container = scrollRef.current
      if (!container) return
      container.scrollTop = container.scrollHeight
    })
    return () => cancelAnimationFrame(raf)
  }, [resolvedChatRoomId, messages.length])
  useLayoutEffect(() => {
    if (!pendingScrollMessageId) return
    const container = scrollRef.current
    if (!container) return
    const target = container.querySelector<HTMLElement>(`[data-message-id="${pendingScrollMessageId}"]`)
    if (!target) return

    const containerTop = container.getBoundingClientRect().top
    const targetTop = target.getBoundingClientRect().top
    const targetCenter = targetTop - containerTop + container.scrollTop + target.offsetHeight / 2
    const nextScrollTop = targetCenter - container.clientHeight / 2
    container.scrollTo({ top: Math.max(0, nextScrollTop) })
    setPendingScrollMessageId(null)
  }, [messages, pendingScrollMessageId, scrollRef])

  return (
    <Screen>
      <Screen.Header>
        <DetailHeaderBar title={headerTitle} onBackClick={goBack} />
      </Screen.Header>

      <Screen.Content ref={scrollRef} className="no-bounce-scroll flex h-full flex-col bg-white">
        <ChatMessageList
          messages={messages}
          chatId={chatId}
          resolvedChatRoomId={resolvedChatRoomId}
          isLoading={isLoading}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          infiniteScrollRef={ref}
          awaitingResponse={isStreamingForThisChat ? awaitingResponse : false}
          streamingMessage={isStreamingForThisChat ? streamingMessage : null}
          onRetry={handleRetry}
        />
      </Screen.Content>
      <ChatInput
        chatRoomId={resolvedChatRoomId}
        floatingAction={
          <ChatFloatingActions
            isAtBottom={isAtBottom}
            onBookmarkClick={() => setIsBookmarkSheetOpen(true)}
            onScrollToBottom={scrollToBottom}
          />
        }
      />
      <BookmarkSheet
        isOpen={isBookmarkSheetOpen}
        onOpenChange={setIsBookmarkSheetOpen}
        chatRoomId={resolvedChatRoomId}
        onSelectBookmark={handleSelectBookmark}
      />
    </Screen>
  )
}
