import {
  ChatRoomMessageData,
  ChatRoomMessageDataSenderTypeEnum,
  ChatRoomStateDataChatRoomStateEnum,
} from '@data/user-api-axios/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'
import React, { useCallback, useMemo } from 'react'
import { z } from 'zod'

import { useAuth } from '@/features/auth'
import { useChatting } from '@/features/chat/context/chatting-context'
import {
  ChatMessageTempStatus,
  useChatMessagesQuery,
  useSendMessageMutation,
} from '@/features/chat/hooks/use-chat-queries'
import { useChatScroll } from '@/features/chat/hooks/use-chat-scroll'
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
import chatService from '@/shared/services/chat.service'
import historyService from '@/shared/services/history.service'
import { DetailHeaderBar } from '@/shared/ui/header-bar'
import { formatDate } from '@/shared/utils'

const searchSchema = z.object({
  chatId: z.number().optional(),
})

export const Route = createFileRoute('/chat/')({
  component: RouteComponent,
  validateSearch: searchSchema,
  loaderDeps: (search) => search,
  loader: async ({ context, deps }) => {
    const { chatId } = deps.search
    await context.queryClient.ensureQueryData(chatService.chatRoomStatusQuery())
    if (chatId) {
      await context.queryClient.ensureInfiniteQueryData(historyService.historyMessagesQuery(chatId))
    }
    return { chatId }
  },
})

const LoadingIndicator = React.forwardRef<HTMLDivElement, { isFetching: boolean }>(({ isFetching }, ref) => (
  <div ref={ref} className="flex h-12 items-center justify-center">
    {isFetching && <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-500" />}
  </div>
))
LoadingIndicator.displayName = 'LoadingIndicator'

function RouteComponent() {
  const { chatId } = Route.useLoaderData()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const goBack = useGoBack()
  const { chatStatus, chattingModal, streamingMessage, awaitingResponse, isChatStatusSuccess, sendingMessage } =
    useChatting()
  const auth = useAuth()

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useChatMessagesQuery(
    isChatStatusSuccess,
    chatStatus,
    chatId
  )

  const { ref } = useInfiniteScroll({ hasNextPage, isFetchingNextPage, fetchNextPage })

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

  const chatCompletionOptions = useMemo(() => chatService.completeChatRoomMutation(), [])
  const { mutate: completeChat, isPending: isCompletingChat } = useMutation({
    mutationFn: chatCompletionOptions.mutationFn,
    onError: chatCompletionOptions.onError,
    onSuccess: async (result) => {
      if (!result?.chatRoomId) {
        navigate({ to: '/', replace: true })
        return
      }

      queryClient.removeQueries({ queryKey: chatService.chatMessagesQuery().queryKey })
      await queryClient.invalidateQueries({ queryKey: chatService.chatRoomStatusQuery().queryKey })

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
                  <React.Fragment key={`${chat.messageId}-${index}`}>
                    <DateDivider currentTimestamp={chat.createdAt} previousTimestamp={previousTimestamp} />
                    {chat.senderType === ChatRoomMessageDataSenderTypeEnum.Assistant ? (
                      <AiChatBubble message={chat.content} timestamp={formatTimestamp(chat.createdAt)} />
                    ) : (
                      <MyChatBubble
                        message={chat.content}
                        timestamp={formatTimestamp(chat.createdAt)}
                        status={(chat as ChatRoomMessageData & ChatMessageTempStatus).status ?? 'sent'}
                        onRetry={() => handleRetry(chat.content!)}
                      />
                    )}
                  </React.Fragment>
                )
              })}

              {awaitingResponse && !streamingMessage && <AiChatBubble isTyping />}

              {streamingMessage && (
                <AiChatBubble
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
      <ChatInput disabled={!!chatId} />
      {!chatId && chattingModal.showChattingTutorial && chattingModal.chattingTutorialModal()}
    </Screen>
  )
}
