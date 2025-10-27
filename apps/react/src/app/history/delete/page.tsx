import { createFileRoute } from '@tanstack/react-router'

import noResultImage from '@/assets/images/characters/empty.png'
import { useChatHistoryQuery } from '@/features/history/hooks/use-chat-history-query'
import { useChatSelect } from '@/features/history/hooks/use-chat-select'
import { EmptyState, SelectableChatHistoryItem } from '@/features/history/ui/chat-history-item'
import { useInfiniteScroll } from '@/shared/hooks/use-infinite-scroll'
import { Screen } from '@/shared/layout/screen'
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
    <Screen>
      <Screen.Header behavior="overlay">
        <DetailHeaderBar
          title="삭제"
          right={backButton()}
          showBackButton={false}
          className="border-b border-b-gray-iron-100 bg-white"
        />
      </Screen.Header>

      <Screen.Content className="relative bg-gray-neutral-100 pb-[calc(var(--safe-bottom)+96px)]">
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
      </Screen.Content>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-50">
        <div className="pointer-events-auto px-5 pb-[calc(var(--safe-bottom)+20px)]">
          <Button
            onClick={handleDelete}
            text={selectedIds.length > 0 ? `${selectedIds.length}개 삭제` : '삭제'}
            disabled={selectedIds.length === 0}
            className={cn('bg-gray-iron-700', {
              'cursor-not-allowed bg-gray-neutral-300': selectedIds.length === 0,
            })}
          />
        </div>
      </div>
    </Screen>
  )
}
