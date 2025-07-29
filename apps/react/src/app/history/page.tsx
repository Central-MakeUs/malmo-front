import { HomeHeaderBar } from '@/shared/components/header-bar'
import { createFileRoute, Link } from '@tanstack/react-router'
import { LucideSearch } from 'lucide-react'
import ChatBubble from '@/assets/icons/chat.svg'
import { cn } from '@ui/common/lib/utils'
import { ChatRoomStateDataChatRoomStateEnum } from '@data/user-api-axios/api'
import { useChatRoomStatusQuery } from '@/features/chat/hook/use-chat-queries'
import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { useChatHistoryQuery } from '@/features/history/hook/use-chat-history-query'
import { useDebounce } from '@/shared/hook/use-deboucne'
import { EmptyState, LinkedChatHistoryItem } from '@/features/history/ui/chat-history-item'
import noResultImage from '@/assets/images/characters/no-result.png'
import emptyImage from '@/assets/images/characters/empty.png'
import { useInfiniteScroll } from '@/shared/hook/use-infinite-scroll'
import { BottomNavigation } from '@/shared/ui'

export const Route = createFileRoute('/history/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data: chatStatus, isSuccess } = useChatRoomStatusQuery()
  const [keyword, setKeyword] = useState('')
  const debouncedKeyword = useDebounce(keyword, 500)

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } = useChatHistoryQuery({
    keyword: debouncedKeyword,
    isSuccess,
  })
  const { ref } = useInfiniteScroll({ hasNextPage, isFetchingNextPage, fetchNextPage })

  const activeChat =
    chatStatus === ChatRoomStateDataChatRoomStateEnum.NeedNextQuestion ||
    chatStatus === ChatRoomStateDataChatRoomStateEnum.Alive

  const histories = data?.pages.flatMap((page) => page?.list || []) ?? []
  const showEmpty = !isFetchingNextPage && histories.length === 0

  return (
    <div className="flex h-screen flex-col pb-15">
      <HomeHeaderBar
        title="대화 기록"
        right={
          <Link to={'/history/delete'}>
            <p className="body2-medium text-gray-iron-700">삭제</p>
          </Link>
        }
      />

      <div className="px-5 pb-3">
        <div className="flex items-center gap-3 rounded-[42px] bg-gray-neutral-100 px-4 py-[13px]">
          <LucideSearch size={20} className="text-gray-iron-400" />
          <input
            type="text"
            placeholder="찾고싶은 대화 제목을 검색해보세요."
            className="w-full bg-transparent text-gray-iron-900 placeholder:text-gray-iron-400 focus:outline-none"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
      </div>

      <section className="flex-1 overflow-y-auto bg-gray-neutral-100">
        {showEmpty ? (
          <EmptyState
            image={keyword || !isFetching ? noResultImage : emptyImage}
            title={keyword || !isFetching ? '검색어와 일치하는 대화 기록이 없어요' : '아직 대화 기록이 없어요'}
            description={keyword || !isFetching ? '다른 검색어를 입력해보세요!' : '모모에게 고민을 이야기해 보세요!'}
          />
        ) : (
          <>
            {histories.map((history) => (
              <LinkedChatHistoryItem key={history.chatRoomId} history={history} />
            ))}
            <div ref={ref} className="h-[1px]" />
            {isFetchingNextPage && <p className="p-5 text-center">더 불러오는 중...</p>}
          </>
        )}
      </section>

      <Link to={'/chat'}>
        <div className="fixed right-5 bottom-21 flex h-[52px] w-[52px] items-center justify-center rounded-full bg-gray-iron-700">
          <div
            className={cn(
              'absolute top-[-42px] right-0 rounded-[17.5px] bg-gray-iron-900 px-4 py-[6px] whitespace-nowrap',
              "before:absolute before:right-[18px] before:bottom-[-4.5px] before:h-3 before:w-3 before:-translate-x-1/2 before:rotate-45 before:rounded-sm before:bg-inherit before:content-['']",
              { hidden: histories.length > 0 && !activeChat }
            )}
          >
            <p className="label1-medium text-gray-iron-200">
              {activeChat ? '진행 중인 대화가 있어요!' : '모모와 고민 상담하러 가기'}
            </p>
          </div>
          <ChatBubble className="h-6 w-6" />
        </div>
      </Link>

      <BottomNavigation />
    </div>
  )
}
