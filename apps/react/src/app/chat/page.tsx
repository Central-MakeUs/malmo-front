import { AiChatBubble, MyChatBubble } from '@/features/chat/components/chat-bubble'
import ChatInput from '@/features/chat/components/chat-input'
import { DateDivider } from '@/features/chat/components/date-divider'
import { useChatting } from '@/features/chat/context/chatting-context'
import { useChatMessagesQuery } from '@/features/chat/hook/use-chat-queries'
import { formatTimestamp } from '@/features/chat/util/chat-format'
import { DetailHeaderBar } from '@/shared/components/header-bar'
import { ChatRoomMessageDataSenderTypeEnum } from '@data/user-api-axios/api'
import { createFileRoute, useNavigate, useRouter } from '@tanstack/react-router'
import { cn } from '@ui/common/lib/utils'
import React, { useCallback, useEffect, useLayoutEffect, useRef } from 'react'
import { z } from 'zod'

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
  const { chattingModal } = useChatting()

  // useInfiniteQuery에서 반환하는 값들을 모두 가져옵니다.
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useChatMessagesQuery()

  const scrollRef = useRef<HTMLElement>(null)
  const scrollHeightRef = useRef(0)

  // 메시지 목록을 단일 배열로 가공합니다.
  const messages = data?.pages.flatMap((page) => page.list ?? []) ?? []

  const observerRef = useRef<IntersectionObserver>(null)
  const sentinelRef = useCallback(
    (node: HTMLDivElement) => {
      if (isFetchingNextPage) return
      if (observerRef.current) observerRef.current.disconnect()

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0]?.isIntersecting && hasNextPage) {
          fetchNextPage()
        }
      })

      if (node) observerRef.current.observe(node)
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  )

  useLayoutEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    // 이전 대화 기록 로드 시 스크롤 위치 유지
    if (scrollHeightRef.current) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight - scrollHeightRef.current
    } else {
      // 컴포넌트 첫 마운트 또는 새 메시지 추가 시 맨 아래로 스크롤
      scrollContainer.scrollTop = scrollContainer.scrollHeight
    }

    // 다음 렌더링을 위해 현재 스크롤 높이를 저장합니다.
    scrollHeightRef.current = scrollContainer.scrollHeight
  })

  const exitButton = useCallback(() => {
    // 새로운 데이터 구조에 맞게 수정
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
        title={chatId?.toString()}
        onBackClick={() => (chatId ? router.history.back() : chattingModal.exitChattingModal())}
      />

      <section className="flex-1 overflow-y-auto" ref={scrollRef}>
        <div className="bg-gray-iron-700 px-[20px] py-[9px]">
          <p className="body3-medium text-white">대화 내용은 상대에게 공유 또는 유출되지 않으니 안심하세요!</p>
        </div>

        {/* 이전 데이터 로딩 UI */}
        {isFetchingNextPage && (
          <div className="flex justify-center py-4">
            <p className="body2-regular text-gray-500">이전 대화를 불러오는 중...</p>
          </div>
        )}

        {/* 무한 스크롤 트리거 */}
        <div ref={sentinelRef} style={{ height: '1px' }} />

        {isLoading && (
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
        </div>
      </section>

      <ChatInput disabled={chatId !== undefined} />
      {chattingModal.showChattingTutorial && chattingModal.chattingTutorialModal()}
    </div>
  )
}
