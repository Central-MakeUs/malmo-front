import { AiChatBubble, MyChatBubble } from '@/features/chat/components/chat-bubble'
import ChatInput from '@/features/chat/components/chat-input'
import { DateDivider } from '@/features/chat/components/date-divider'
import { useChatting } from '@/features/chat/context/chatting-context'
import { useChatMessagesQuery } from '@/features/chat/hook/use-chat-queries'
import { formatTimestamp } from '@/features/chat/util/chat-format'
import { DetailHeaderBar } from '@/shared/components/header-bar'
import { formatDate } from '@/shared/utils'
import { ChatRoomMessageDataSenderTypeEnum, ChatRoomStateDataChatRoomStateEnum } from '@data/user-api-axios/api'
import { createFileRoute, Link, useNavigate, useRouter } from '@tanstack/react-router'
import { cn } from '@ui/common/lib/utils'
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { z } from 'zod'
import { useInView } from 'react-intersection-observer'
import { ChevronRight } from 'lucide-react'
import { useInfiniteScroll } from '@/shared/hook/use-infinite-scroll'

const searchSchema = z.object({
  chatId: z.number().optional(),
})

export const Route = createFileRoute('/chat/')({
  component: RouteComponent,
  validateSearch: searchSchema,
  loaderDeps: (search) => search,
  loader: async ({ context, deps }) => {
    const { chatId } = deps.search
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
  const { chatStatus, chattingModal, streamingMessage, isChatStatusSuccess } = useChatting()

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useChatMessagesQuery(
    isChatStatusSuccess,
    chatStatus,
    chatId
  )

  const scrollRef = useRef<HTMLElement>(null)
  const scrollHeightRef = useRef(0)

  const { ref } = useInfiniteScroll({ hasNextPage, isFetchingNextPage, fetchNextPage })

  const messages = useMemo(() => {
    if (!data) return []
    const allMessages = data.pages.flatMap((page) => page.list ?? [])
    return chatId ? allMessages : [...allMessages].reverse()
  }, [data, chatId])

  // 실시간 채팅에서 이전 대화 로드 시 스크롤 위치 보정
  useLayoutEffect(() => {
    if (chatId) return

    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    // 새 메시지가 추가되어 스크롤 높이가 변경되었을 때, 현재 스크롤 위치를 유지합니다.
    if (scrollContainer.scrollHeight > scrollHeightRef.current) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight - scrollHeightRef.current
    } else {
      // 새로운 메시지를 보내거나 처음 로드될 때는 맨 아래로 스크롤합니다.
      scrollContainer.scrollTop = scrollContainer.scrollHeight
    }

    scrollHeightRef.current = scrollContainer.scrollHeight
  }, [messages, chatId, streamingMessage])

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
    <div className="flex h-full flex-col">
      <DetailHeaderBar
        right={chatId ? undefined : exitButton()}
        title={chatId ? formatDate(messages[0]?.createdAt, 'YYYY년 MM월 DD일') : ''}
        onBackClick={() => (chatId ? router.history.back() : chattingModal.exitChattingModal())}
      />

      <section className="flex flex-1 flex-col overflow-y-auto" ref={scrollRef}>
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
            <AiChatBubble message={streamingMessage.content} timestamp={formatTimestamp(streamingMessage.createdAt)} />
          )}

          {chatStatus === ChatRoomStateDataChatRoomStateEnum.Paused && (
            <Link
              to="/" // TODO: 마이페이지로 라우팅 필요
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
      {chattingModal.showChattingTutorial && chattingModal.chattingTutorialModal()}
    </div>
  )
}
