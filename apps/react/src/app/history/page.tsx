import { ChatRoomStateDataChatRoomStateEnum } from '@data/user-api-axios/api'
import { createFileRoute, Link } from '@tanstack/react-router'
import { LucideSearch } from 'lucide-react'
import { useState } from 'react'

import ChatBubble from '@/assets/icons/chat.svg'
import emptyImage from '@/assets/images/characters/empty.png'
import noResultImage from '@/assets/images/characters/no-result.png'
import { useChatRoomStatusQuery } from '@/features/chat/hooks/use-chat-queries'
import { useChatHistoryQuery } from '@/features/history/hooks/use-chat-history-query'
import { EmptyState, LinkedChatHistoryItem } from '@/features/history/ui/chat-history-item'
import { useDebounce } from '@/shared/hooks/use-debounce'
import { useInfiniteScroll } from '@/shared/hooks/use-infinite-scroll'
import { cn } from '@/shared/lib/cn'
import chatService from '@/shared/services/chat.service'
import { BottomNavigation } from '@/shared/ui'
import { HomeHeaderBar } from '@/shared/ui/header-bar'
import { Spinner } from '@/shared/ui/spinner'

export const Route = createFileRoute('/history/')({
  component: RouteComponent,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(chatService.chatRoomStatusQuery())
  },
})

function RouteComponent() {
  const { data: chatStatus, isSuccess } = useChatRoomStatusQuery()
  const [keyword, setKeyword] = useState('')
  const debouncedKeyword = useDebounce(keyword, 750)

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } = useChatHistoryQuery({
    keyword: debouncedKeyword,
    isSuccess,
  })
  const { ref } = useInfiniteScroll({ hasNextPage, isFetchingNextPage, fetchNextPage })

  const activeChat =
    chatStatus === ChatRoomStateDataChatRoomStateEnum.NeedNextQuestion ||
    chatStatus === ChatRoomStateDataChatRoomStateEnum.Alive

  const histories = data?.pages.flatMap((page) => page?.list || []) ?? []
  const isLoading = isFetching && !isFetchingNextPage

  return (
    <div className="has-bottom-nav flex min-h-[100dvh] flex-col pt-30">
      <div className="fixed top-[var(--safe-top)] z-20 bg-white">
        <HomeHeaderBar
          title="대화 기록"
          right={
            <Link to={'/history/delete'}>
              <p className="body2-medium text-gray-iron-700">삭제</p>
            </Link>
          }
        />
        <div className="px-5 pb-3">
          <div className="relative flex items-center">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <LucideSearch size={20} className="text-gray-iron-800" />
            </div>
            <input
              type="text"
              placeholder="찾고 싶은 대화 제목을 검색해 보세요"
              className="w-full rounded-[42px] bg-gray-neutral-100 py-[13px] pr-10 pl-12 text-gray-iron-900 placeholder:text-gray-iron-400 focus:outline-none"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            {isLoading && (
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                <Spinner className="h-5 w-5 text-gray-iron-400" />
              </div>
            )}
          </div>
        </div>
      </div>

      <section
        className={`min-h-0 flex-1 bg-gray-neutral-100 transition-opacity ${histories.length === 0 || isLoading ? 'overflow-hidden' : 'overflow-y-auto'}`}
      >
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <Spinner className="h-5 w-5 text-gray-400" />
          </div>
        ) : histories.length === 0 ? (
          <EmptyState
            image={debouncedKeyword ? noResultImage : emptyImage}
            title={debouncedKeyword ? '검색어와 일치하는 대화 기록이 없어요' : '아직 대화 기록이 없어요'}
            description={debouncedKeyword ? '다른 검색어를 입력해보세요!' : '모모에게 고민을 이야기해 보세요!'}
          />
        ) : (
          <>
            {histories.map((history, index) => (
              <div key={history.chatRoomId}>
                <LinkedChatHistoryItem history={history} />
                {index < histories.length - 1 && <hr className="h-[6px] border-0 bg-gray-neutral-50" />}
              </div>
            ))}
            <div ref={ref} className="h-[1px]" />
            {isFetchingNextPage && <p className="p-5 text-center">더 불러오는 중...</p>}
          </>
        )}
      </section>

      <Link to={'/chat'}>
        <div className="fixed right-5 bottom-[calc(var(--safe-bottom)+var(--bottom-nav-h)+16px)] z-50 flex h-[52px] w-[52px] items-center justify-center rounded-full bg-gray-iron-700">
          <div
            className={cn(
              'absolute top-[-42px] right-0 rounded-[17.5px] bg-gray-iron-900 px-4 py-[6px] whitespace-nowrap',
              "before:absolute before:right-[18px] before:bottom-[-4.5px] before:h-3 before:w-3 before:-translate-x-1/2 before:rotate-45 before:rounded-sm before:bg-inherit before:content-['']"
            )}
          >
            <p className="label1-medium text-gray-iron-200">
              {activeChat ? '진행 중인 대화가 있어요!' : '모모와 고민 상담하러 가기'}
            </p>
          </div>
          <ChatBubble className="h-6 w-6 drop-shadow-[1px_2px_12px_rgba(0,0,0,0.15)]" />
        </div>
      </Link>

      <BottomNavigation />
    </div>
  )
}
