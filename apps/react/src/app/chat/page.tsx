import { ChatRoomMessageDataSenderTypeEnum, ChatRoomStateDataChatRoomStateEnum } from '@data/user-api-axios/api'
import { createFileRoute, Link, useNavigate, useRouter } from '@tanstack/react-router'
import { useBridge } from '@webview-bridge/react'
import { ChevronRight } from 'lucide-react'
import React, { useCallback, useMemo } from 'react'
import { z } from 'zod'

import { useAuth } from '@/features/auth'
import { useChatting } from '@/features/chat/context/chatting-context'
import { useChatMessagesQuery } from '@/features/chat/hooks/use-chat-queries'
import { useChatScroll } from '@/features/chat/hooks/use-chat-scroll'
import { AiChatBubble, MyChatBubble } from '@/features/chat/ui/chat-bubble'
import ChatInput from '@/features/chat/ui/chat-input'
import { DateDivider } from '@/features/chat/ui/date-divider'
import { formatTimestamp } from '@/features/chat/util/chat-format'
import bridge from '@/shared/bridge'
import { useInfiniteScroll } from '@/shared/hooks/use-infinite-scroll'
import { cn } from '@/shared/lib/cn'
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

    // 채팅방 상태 조회
    await context.queryClient.ensureQueryData(chatService.chatRoomStatusQuery())

    // chatId가 있으면 해당 히스토리 메시지도 미리 캐시에 저장
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
  const router = useRouter()
  const navigate = useNavigate()
  const { chatStatus, chattingModal, streamingMessage, isChatStatusSuccess, sendingMessage } = useChatting()
  const keyboardHeight = useBridge(bridge.store, (state) => state.keyboardHeight)
  const auth = useAuth()

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useChatMessagesQuery(
    isChatStatusSuccess,
    chatStatus,
    chatId
  )

  const { ref } = useInfiniteScroll({ hasNextPage, isFetchingNextPage, fetchNextPage })

  const messages = useMemo(() => {
    if (chattingModal.showChattingTutorial) return []
    if (!data || !auth.userInfo.loveTypeCategory) return []
    const allMessages = data.pages.flatMap((page) => page?.list ?? [])
    return chatId ? allMessages : [...allMessages].reverse()
  }, [data, chatId, chattingModal.showChattingTutorial])

  const scrollRef = useChatScroll({
    chatId,
    isFetchingNextPage,
    sendingMessage,
    messages,
    streamingMessage,
  })

  const exitButton = useCallback(() => {
    const actived = messages.some((chat) => chat.senderType === ChatRoomMessageDataSenderTypeEnum.User)
    return (
      <p
        className={cn('body2-medium text-malmo-rasberry-500', { 'text-gray-300': !actived })}
        onClick={() => {
          if (actived) navigate({ to: '/chat/loading', replace: true })
        }}
      >
        종료하기
      </p>
    )
  }, [messages, navigate])

  return (
    <>
      <div
        className="app-safe fixed top-0 flex h-screen flex-col pb-[var(--safe-bottom)] transition-[padding-bottom] duration-[250ms] ease-[cubic-bezier(0.17,0.59,0.4,0.77)]"
        style={{
          paddingBottom: keyboardHeight ? `calc(${keyboardHeight}px + var(--safe-bottom))` : 'var(--safe-bottom)',
        }}
      >
        <DetailHeaderBar
          right={chatId ? undefined : exitButton()}
          title={chatId ? formatDate(messages[0]?.createdAt, 'YYYY년 MM월 DD일') : ''}
          onBackClick={() => (chatId ? router.history.back() : chattingModal.exitChattingModal())}
        />

        <section className="no-bounce-scroll flex flex-1 flex-col" ref={scrollRef}>
          <div className="bg-gray-iron-700 px-[20px] py-[9px]">
            <p className="body3-medium text-center text-white">
              대화 내용은 상대에게 공유 또는 유출되지 않으니 안심하세요!
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
                    <MyChatBubble message={chat.content} timestamp={formatTimestamp(chat.createdAt)} />
                  )}
                </React.Fragment>
              )
            })}

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
              >
                <p className="body3-semibold">마이페이지로 이동하기</p>
                <ChevronRight className="h-4 w-4" />
              </Link>
            )}
          </div>

          {chatId && hasNextPage && <LoadingIndicator ref={ref} isFetching={isFetchingNextPage} />}
        </section>

        <ChatInput disabled={!!chatId} />
      </div>
      {chattingModal.showChattingTutorial && chattingModal.chattingTutorialModal()}
    </>
  )
}
