// features/chat/page.tsx

import { AiChatBubble, MyChatBubble } from '@/features/chat/components/chat-bubble'
import ChatInput from '@/features/chat/components/chat-input'
import { DateDivider } from '@/features/chat/components/date-divider'
import { useChatting } from '@/features/chat/context/chatting-context'
import { useChatMessagesQuery } from '@/features/chat/hook/use-chat-queries'
import { formatTimestamp } from '@/features/chat/util/chat-format'
import { DetailHeaderBar } from '@/shared/components/header-bar'
import { formatDate } from '@/shared/utils'
import { ChatRoomMessageDataSenderTypeEnum } from '@data/user-api-axios/api'
import { createFileRoute, useNavigate, useRouter } from '@tanstack/react-router'
import { cn } from '@ui/common/lib/utils'
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { z } from 'zod'
import { useInView } from 'react-intersection-observer'

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

function RouteComponent() {
  const { chatId } = Route.useLoaderData()
  const router = useRouter()
  const navigate = useNavigate()
  const { chattingModal, streamingMessage, isChatStatusSuccess } = useChatting()

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useChatMessagesQuery(
    isChatStatusSuccess,
    chatId
  )

  const scrollRef = useRef<HTMLElement>(null)
  const scrollHeightRef = useRef(0)
  const topMessageIdRef = useRef<number | string | null>(null)

  // chatId가 있을 경우 (히스토리 뷰), 아래로 스크롤하여 새 페이지 로드
  const { ref: bottomRef, inView: isBottomInView } = useInView({ threshold: 0 })

  // chatId가 없을 경우 (실시간 채팅), 위로 스크롤하여 이전 페이지 로드
  const { ref: topRef, inView: isTopInView } = useInView({ threshold: 0 })

  useEffect(() => {
    // 뷰의 맨 아래/위가 감지되고, 다음 페이지가 있으며, 로딩 중이 아닐 때 fetch
    if ((isBottomInView || isTopInView) && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [isBottomInView, isTopInView, hasNextPage, isFetchingNextPage, fetchNextPage])

  const messages = useMemo(() => {
    if (!data) return []
    const allMessages = data.pages.flatMap((page) => page.list ?? [])
    return chatId ? allMessages : allMessages.reverse()
  }, [data, chatId])

  // 실시간 채팅에서만 스크롤 위치를 보정 (위로 스크롤 시)
  useLayoutEffect(() => {
    if (chatId) return

    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    const newTopMessageId = messages[0]?.messageId ?? null

    if (newTopMessageId !== topMessageIdRef.current && scrollContainer.scrollHeight > scrollHeightRef.current) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight - scrollHeightRef.current
    } else {
      scrollContainer.scrollTop = scrollContainer.scrollHeight
    }

    scrollHeightRef.current = scrollContainer.scrollHeight
    topMessageIdRef.current = newTopMessageId
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

        {isFetchingNextPage && (
          <div className="flex justify-center py-4">
            <p className="body2-regular text-gray-500">
              {chatId ? '다음 대화를 불러오는 중...' : '이전 대화를 불러오는 중...'}
            </p>
          </div>
        )}

        {/* 실시간 채팅: 상단 트리거 */}
        {!chatId && hasNextPage && <div ref={topRef} className="h-[1px]" />}

        {(isLoading || !isChatStatusSuccess) && (
          <div className="flex flex-1 items-center justify-center">
            <p className="body2-regular text-gray-500">채팅 데이터를 불러오는 중...</p>
          </div>
        )}

        <div className="space-y-5 px-5 py-6">
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
        </div>

        {/* 히스토리 뷰: 하단 트리거 */}
        {chatId && hasNextPage && <div ref={bottomRef} className="h-[1px]" />}
      </section>

      <ChatInput disabled={chatId !== undefined} />
      {chattingModal.showChattingTutorial && chattingModal.chattingTutorialModal()}
    </div>
  )
}
