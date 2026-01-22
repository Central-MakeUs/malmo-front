import { ChatRoomMessageDataSenderTypeEnum, ChatRoomStateDataChatRoomStateEnum } from '@data/user-api-axios/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useCallback, useLayoutEffect, useMemo, useState } from 'react'
import { z } from 'zod'

import { useAuth } from '@/features/auth'
import { BookmarkSheet, useBookmarkSelection } from '@/features/bookmark'
import { useChatting } from '@/features/chat/context/chatting-context'
import {
  useChatMessagesQuery,
  useCurrentChatRoomQuery,
  useSendMessageMutation,
} from '@/features/chat/hooks/use-chat-queries'
import { useChatScroll } from '@/features/chat/hooks/use-chat-scroll'
import { useScrollToBottom } from '@/features/chat/hooks/use-scroll-to-bottom'
import { ChatFloatingActions } from '@/features/chat/ui/chat-floating-actions'
import ChatInput from '@/features/chat/ui/chat-input'
import { ChatMessageList } from '@/features/chat/ui/chat-message-list'
import { wrapWithTracking } from '@/shared/analytics'
import { BUTTON_NAMES, CATEGORIES } from '@/shared/analytics/constants'
import { useInfiniteScroll } from '@/shared/hooks/use-infinite-scroll'
import { Screen } from '@/shared/layout/screen'
import { cn } from '@/shared/lib/cn'
import { useGoBack } from '@/shared/navigation/use-go-back'
import chatService from '@/shared/services/chat.service'
import { queryKeys } from '@/shared/services/query-keys'
import { DetailHeaderBar } from '@/shared/ui/header-bar'
import { formatDate } from '@/shared/utils'

const searchSchema = z.object({
  chatId: z.number().optional(),
})

export const Route = createFileRoute('/chat/')({
  component: RouteComponent,
  validateSearch: searchSchema,
})

function RouteComponent() {
  const { chatId } = Route.useSearch()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const goBack = useGoBack()
  const { chatStatus, chattingModal, streamingMessage, awaitingResponse, isChatStatusSuccess, sendingMessage } =
    useChatting()
  const auth = useAuth()
  const [isBookmarkSheetOpen, setIsBookmarkSheetOpen] = useState(false)

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useChatMessagesQuery(
    isChatStatusSuccess,
    chatStatus,
    chatId
  )
  const { data: currentChatRoom } = useCurrentChatRoomQuery(!chatId)
  const resolvedChatRoomId = chatId ?? currentChatRoom?.chatRoomId

  const { ref } = useInfiniteScroll({ hasNextPage, isFetchingNextPage, fetchNextPage })
  const [pendingScrollMessageId, setPendingScrollMessageId] = useState<number | null>(null)

  const messages = useMemo(() => {
    if (!chatId && chattingModal.showChattingTutorial && chatStatus === ChatRoomStateDataChatRoomStateEnum.BeforeInit)
      return []
    if (!data || !auth.userInfo.loveTypeCategory) return []
    const allMessages = data.pages.flatMap((page) => page?.list ?? [])
    return chatId ? allMessages : [...allMessages].reverse()
  }, [data, chatId, chattingModal.showChattingTutorial, auth.userInfo.loveTypeCategory])

  const hasUserMessage = useMemo(
    () => messages.some((chat) => chat.senderType === ChatRoomMessageDataSenderTypeEnum.User),
    [messages]
  )

  const scrollRef = useChatScroll({
    chatId,
    isFetchingNextPage,
    sendingMessage,
    messages,
    streamingMessage,
    awaitingResponse,
  })

  const { isAtBottom, scrollToBottom } = useScrollToBottom({
    scrollRef,
    deps: [messages.length, streamingMessage?.content],
  })

  const { handleSelectBookmark } = useBookmarkSelection({
    chatId,
    onSelectComplete: (targetMessageId) => {
      setPendingScrollMessageId(targetMessageId ?? null)
      setIsBookmarkSheetOpen(false)
    },
  })

  const chatCompletionOptions = useMemo(() => chatService.completeChatRoomMutation(), [])
  const { mutate: completeChat, isPending: isCompletingChat } = useMutation({
    mutationFn: chatCompletionOptions.mutationFn,
    onError: chatCompletionOptions.onError,
    onSuccess: async (result) => {
      if (!result?.chatRoomId) {
        navigate({ to: '/', replace: true })
        return
      }

      queryClient.removeQueries({ queryKey: queryKeys.chat.messages() })
      await Promise.all([queryClient.invalidateQueries({ queryKey: queryKeys.chat.status() })])

      navigate({
        to: '/chat/loading',
        search: { chatId: result.chatRoomId },
        replace: true,
      })
    },
  })

  const exitButton = useCallback(() => {
    const disabled = !hasUserMessage || isCompletingChat

    return (
      <p
        className={cn('body2-medium text-malmo-rasberry-500', {
          'text-gray-300': disabled,
          'pointer-events-none': disabled,
          'cursor-not-allowed': disabled,
        })}
        onClick={wrapWithTracking(BUTTON_NAMES.EXIT_CHAT, CATEGORIES.CHAT, () => {
          if (disabled) return
          completeChat()
        })}
      >
        종료하기
      </p>
    )
  }, [completeChat, hasUserMessage, isCompletingChat])

  const { mutate: sendMessage } = useSendMessageMutation()

  const handleRetry = wrapWithTracking(BUTTON_NAMES.RETRY_MESSAGE, CATEGORIES.CHAT, (content: string) =>
    sendMessage(content)
  )
  const handleGoMyPage = wrapWithTracking(BUTTON_NAMES.GO_MYPAGE_FROM_CHAT, CATEGORIES.CHAT)

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
        <DetailHeaderBar
          right={chatId ? undefined : exitButton()}
          title={chatId ? formatDate(messages[0]?.createdAt, 'YYYY년 MM월 DD일') : ''}
          onBackClick={() => {
            if (chatId) {
              goBack()
            } else {
              chattingModal.exitChattingModal()
            }
          }}
        />
      </Screen.Header>

      <Screen.Content ref={scrollRef} className="no-bounce-scroll flex h-full flex-col bg-white">
        <ChatMessageList
          messages={messages}
          chatId={chatId}
          chatStatus={chatStatus}
          resolvedChatRoomId={resolvedChatRoomId}
          isLoading={isLoading}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          infiniteScrollRef={ref}
          awaitingResponse={awaitingResponse}
          streamingMessage={streamingMessage}
          onRetry={handleRetry}
          onGoMyPage={handleGoMyPage}
        />
      </Screen.Content>
      <ChatInput
        disabled={!!chatId}
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
      {!chatId && chattingModal.showChattingTutorial && chattingModal.chattingTutorialModal()}
    </Screen>
  )
}
