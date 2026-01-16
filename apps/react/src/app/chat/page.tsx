import {
  BaseListSwaggerResponseChatRoomMessageData,
  ChatRoomMessageData,
  ChatRoomMessageDataSenderTypeEnum,
  ChatRoomStateDataChatRoomStateEnum,
} from '@data/user-api-axios/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { ArrowDown, Bookmark, ChevronRight } from 'lucide-react'
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { z } from 'zod'

import { useAuth } from '@/features/auth'
import { useChatting } from '@/features/chat/context/chatting-context'
import {
  ChatMessageTempStatus,
  useChatMessagesQuery,
  useCurrentChatRoomQuery,
  useSendMessageMutation,
} from '@/features/chat/hooks/use-chat-queries'
import { useChatScroll } from '@/features/chat/hooks/use-chat-scroll'
import { BookmarkSheet } from '@/features/chat/ui/bookmark-sheet'
import { AiChatBubble, MyChatBubble } from '@/features/chat/ui/chat-bubble'
import ChatInput from '@/features/chat/ui/chat-input'
import { DateDivider } from '@/features/chat/ui/date-divider'
import { formatTimestamp } from '@/features/chat/util/chat-format'
import { wrapWithTracking } from '@/shared/analytics'
import { BUTTON_NAMES, CATEGORIES } from '@/shared/analytics/constants'
import { useInfiniteScroll } from '@/shared/hooks/use-infinite-scroll'
import { Screen } from '@/shared/layout/screen'
import { cn } from '@/shared/lib/cn'
import { useGoBack } from '@/shared/navigation/use-go-back'
import bookmarkService from '@/shared/services/bookmark.service'
import chatService from '@/shared/services/chat.service'
import historyService from '@/shared/services/history.service'
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

const LoadingIndicator = React.forwardRef<HTMLDivElement, { isFetching: boolean }>(({ isFetching }, ref) => (
  <div ref={ref} className="flex h-12 items-center justify-center">
    {isFetching && <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-500" />}
  </div>
))
LoadingIndicator.displayName = 'LoadingIndicator'

function RouteComponent() {
  const { chatId } = Route.useSearch()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const goBack = useGoBack()
  const { chatStatus, chattingModal, streamingMessage, awaitingResponse, isChatStatusSuccess, sendingMessage } =
    useChatting()
  const auth = useAuth()
  const [isBookmarkSheetOpen, setIsBookmarkSheetOpen] = useState(false)
  const [isAtBottom, setIsAtBottom] = useState(true)

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

  useEffect(() => {
    const container = scrollRef.current
    if (!container) return

    const updateIsAtBottom = () => {
      const threshold = 24
      const atBottom = container.scrollHeight - container.scrollTop - container.clientHeight <= threshold
      setIsAtBottom(atBottom)
    }

    updateIsAtBottom()
    container.addEventListener('scroll', updateIsAtBottom)
    return () => container.removeEventListener('scroll', updateIsAtBottom)
  }, [scrollRef])

  useEffect(() => {
    const container = scrollRef.current
    if (!container) return
    const threshold = 24
    const atBottom = container.scrollHeight - container.scrollTop - container.clientHeight <= threshold
    setIsAtBottom(atBottom)
  }, [messages.length, streamingMessage?.content, scrollRef])

  const { mutateAsync: fetchBookmarkMessages, isPending: isLoadingBookmarkMessages } = useMutation(
    bookmarkService.bookmarkMessagesMutation()
  )

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

  const handleSelectBookmark = useCallback(
    async (bookmarkId: number, targetChatRoomId: number) => {
      if (isLoadingBookmarkMessages) return
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
      setPendingScrollMessageId(result?.targetMessageId ?? null)
      setIsBookmarkSheetOpen(false)
    },
    [chatId, fetchBookmarkMessages, isLoadingBookmarkMessages, queryClient]
  )

  useLayoutEffect(() => {
    if (!pendingScrollMessageId) return
    const container = scrollRef.current
    if (!container) return
    const target = container.querySelector<HTMLElement>(`[data-message-id="${pendingScrollMessageId}"]`)
    if (!target) return

    const containerTop = container.getBoundingClientRect().top
    const targetTop = target.getBoundingClientRect().top
    const offsetTop = targetTop - containerTop + container.scrollTop
    container.scrollTo({ top: Math.max(0, offsetTop - 16) })
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
        <div className="flex flex-1 flex-col">
          <section className="no-bounce-scroll flex flex-1 flex-col overflow-y-auto">
            <div className="bg-gray-iron-700 px-[20px] py-[9px]">
              <p className="body3-medium text-center text-white">
                연동 후에도 대화 내용은 상대에게 공유되지 않으니 안심하세요!
              </p>
            </div>

            {isLoading && (
              <div className="flex flex-1 items-center justify-center">
                <LoadingIndicator isFetching={true} />
              </div>
            )}

            {!chatId && hasNextPage && <LoadingIndicator ref={ref} isFetching={isFetchingNextPage} />}

            <div className="flex flex-col gap-6 px-5 py-[22px]">
              {messages.map((chat, index) => {
                const previousTimestamp = index > 0 ? messages[index - 1]?.createdAt : undefined
                return (
                  <div key={`${chat.messageId}-${index}`} data-message-id={chat.messageId}>
                    <DateDivider currentTimestamp={chat.createdAt} previousTimestamp={previousTimestamp} />
                    {chat.senderType === ChatRoomMessageDataSenderTypeEnum.Assistant ? (
                      <AiChatBubble
                        messageId={chat.messageId}
                        chatRoomId={resolvedChatRoomId}
                        message={chat.content}
                        timestamp={formatTimestamp(chat.createdAt)}
                      />
                    ) : (
                      <MyChatBubble
                        messageId={chat.messageId}
                        chatRoomId={resolvedChatRoomId}
                        message={chat.content}
                        timestamp={formatTimestamp(chat.createdAt)}
                        status={(chat as ChatRoomMessageData & ChatMessageTempStatus).status ?? 'sent'}
                        onRetry={() => handleRetry(chat.content!)}
                      />
                    )}
                  </div>
                )
              })}

              {awaitingResponse && !streamingMessage && <AiChatBubble isTyping />}

              {streamingMessage && (
                <AiChatBubble
                  messageId={streamingMessage.messageId}
                  chatRoomId={resolvedChatRoomId}
                  message={streamingMessage.content}
                  timestamp={formatTimestamp(streamingMessage.createdAt)}
                />
              )}

              {chatStatus === ChatRoomStateDataChatRoomStateEnum.Paused && (
                <Link
                  to="/my-page"
                  className="mt-[-12px] ml-[62px] flex w-fit items-center gap-1 rounded-[8px] border border-malmo-rasberry-300 py-2 pr-[12px] pl-[18px] text-malmo-rasberry-500 shadow-[1px_3px_8px_rgba(0,0,0,0.08)]"
                  onClick={wrapWithTracking(BUTTON_NAMES.GO_MYPAGE_FROM_CHAT, CATEGORIES.CHAT)}
                >
                  <p className="body3-semibold">마이페이지로 이동하기</p>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              )}
            </div>

            {chatId && hasNextPage && <LoadingIndicator ref={ref} isFetching={isFetchingNextPage} />}
          </section>
        </div>
      </Screen.Content>
      <ChatInput
        disabled={!!chatId}
        floatingAction={
          <>
            {!isAtBottom && (
              <button
                type="button"
                aria-label="맨 아래로 이동"
                className="absolute -top-[54px] right-0 z-10 flex h-10 w-10 items-center justify-center rounded-[26px] bg-white"
                onClick={() => {
                  const container = scrollRef.current
                  if (!container) return
                  container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' })
                }}
              >
                <ArrowDown className="h-6 w-6 text-gray-iron-700" />
              </button>
            )}
            <button
              type="button"
              aria-label="북마크"
              className={cn(
                'absolute right-0 z-10 flex h-10 w-10 items-center justify-center rounded-[26px] bg-gray-iron-700',
                isAtBottom ? '-top-[54px]' : '-top-[100px]'
              )}
              onClick={() => setIsBookmarkSheetOpen(true)}
            >
              <Bookmark className="h-5 w-5 text-white" fill="currentColor" />
            </button>
          </>
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
