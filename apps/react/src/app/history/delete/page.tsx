import { createFileRoute } from '@tanstack/react-router'

import noResultImage from '@/assets/images/characters/empty.png'
import { useChatHistoryQuery } from '@/features/history/hooks/use-chat-history-query'
import { useChatSelect } from '@/features/history/hooks/use-chat-select'
import { EmptyState, SelectableChatHistoryItem } from '@/features/history/ui/chat-history-item'
import { useInfiniteScroll } from '@/shared/hooks/use-infinite-scroll'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/shared/ui'
import { DetailHeaderBar } from '@/shared/ui/header-bar'

export const Route = createFileRoute('/history/delete/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useChatHistoryQuery({})
  const { ref } = useInfiniteScroll({ hasNextPage, isFetchingNextPage, fetchNextPage })

  const histories = data?.pages.flatMap((page) => page?.list || []) ?? []
  const { selectedIds, handleToggleSelect, handleDelete, backButton } = useChatSelect()

  const showEmpty = !isFetchingNextPage && histories.length === 0

  return (
    <div className="flex h-screen flex-col">
      <DetailHeaderBar title="삭제" left={backButton()} className="border-b-[1px] border-b-gray-iron-100" />

      <section className="flex-1 overflow-y-auto bg-gray-neutral-100 pb-20">
        {showEmpty ? (
          <EmptyState
            image={noResultImage}
            title="삭제할 대화 기록이 없어요"
            description="모모에게 고민을 이야기해 보세요!"
          />
        ) : (
          <>
            {histories.map((history) => (
              <SelectableChatHistoryItem
                key={history.chatRoomId}
                history={history}
                isSelected={selectedIds.includes(history.chatRoomId!)}
                onToggleSelect={handleToggleSelect}
              />
            ))}
            <div ref={ref} className="h-[1px]" />
            {isFetchingNextPage && <p className="p-5 text-center">더 불러오는 중...</p>}
          </>
        )}
      </section>

      <div className="fixed right-0 bottom-0 left-0 p-5">
        <Button
          onClick={handleDelete}
          text={selectedIds.length > 0 ? `${selectedIds.length}개 삭제` : '삭제'}
          disabled={selectedIds.length === 0}
          className={cn('bg-gray-iron-700', { 'cursor-not-allowed bg-gray-neutral-300': selectedIds.length === 0 })}
        />
      </div>
    </div>
  )
}
