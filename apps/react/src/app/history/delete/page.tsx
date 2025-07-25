import { DetailHeaderBar } from '@/shared/components/header-bar'
import { createFileRoute, Link } from '@tanstack/react-router'
import emptyImage from '@/assets/images/onboarding-end.png'
import { GetChatRoomListResponse } from '@data/user-api-axios/api'
import { formatDate } from '@/shared/utils'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import historyService from '@/shared/services/history.service'
import { useInView } from 'react-intersection-observer'
import { Button } from '@/shared/ui'
import CheckedCircle from '@/assets/icons/checked-circle.svg'
import { cn } from '@ui/common/lib/utils'
import { useChattingModal } from '@/features/chat/hook/use-chatting-modal'

export const Route = createFileRoute('/history/delete/')({
  component: RouteComponent,
})

const CheckIcon = ({ isChecked }: { isChecked: boolean }) => {
  return isChecked ? (
    <CheckedCircle className="h-[22px] w-[22px]" />
  ) : (
    <div className="h-[22px] w-[22px] rounded-full border border-gray-iron-400" />
  )
}

function RouteComponent() {
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const { ref, inView } = useInView()
  const chattingModal = useChattingModal()

  const {
    data: chatHistoryData,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['histories'],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await historyService.getHistoryList({ pageable: { page: pageParam, size: 10 } })
      return response.data
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage || lastPage.totalCount == null) {
        return undefined
      }

      const fetchedItemsCount = allPages.flatMap((page) => page?.list || []).length

      if (fetchedItemsCount >= lastPage.totalCount) {
        return undefined
      }

      return allPages.length
    },
  })

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

  const histories = chatHistoryData?.pages.flatMap((page) => page?.list || []) ?? []

  const ChatHistoryItem = ({
    history,
    isSelected,
    onToggleSelect,
  }: {
    history: GetChatRoomListResponse
    isSelected: boolean
    onToggleSelect: (id?: number) => void
  }) => (
    <div
      className="mb-[6px] flex cursor-pointer items-center justify-between bg-white px-5 py-6"
      onClick={() => onToggleSelect(history.chatRoomId)}
    >
      <div className="flex items-center gap-5">
        <CheckIcon isChecked={isSelected} />
        <div>
          <div className="mb-[10px] flex gap-1">
            <div className="rounded-[8px] bg-malmo-rasberry-25 px-[9px] py-[1px]">
              <p className="label1-semibold text-malmo-rasberry-500">{history.situationKeyword}</p>
            </div>
            <div className="rounded-[8px] bg-malmo-orange-50 px-[9px] py-[1px]">
              <p className="label1-semibold text-malmo-orange-500">{history.solutionKeyword}</p>
            </div>
          </div>
          <div className="pl-1">
            <p className="label1-medium text-gray-iron-500">{formatDate(history.createdAt, 'YYYY년 MM월 DD일')}</p>
            <h1 className="body1-semibold">{history.totalSummary}</h1>
          </div>
        </div>
      </div>
    </div>
  )

  const EmptyItem = () => (
    <div>
      <img src={emptyImage} alt="Empty State" className="mb-5 px-[28px] pt-11" />
      <div className="text-center">
        <p className="heading1-bold mb-1">삭제할 대화 기록이 없어요</p>
        <p className="body2-medium text-gray-iron-500">모모에게 고민을 이야기해 보세요!</p>
      </div>
    </div>
  )

  const handleToggleSelect = (id?: number) => {
    if (id === undefined) return
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const isAllSelected = histories.length > 0 && selectedIds.length === histories.length

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([])
    } else {
      setSelectedIds(histories.map((h) => h.chatRoomId).filter((id): id is number => id !== undefined))
    }
  }

  // ## 5. 삭제 버튼 클릭 핸들러
  const handleDelete = () => {
    chattingModal.deleteChatHistoriesModal(selectedIds)
  }

  return (
    <div className="flex h-screen flex-col">
      <DetailHeaderBar title="삭제" />

      <div className="flex cursor-pointer items-center gap-4 px-5 py-3" onClick={handleSelectAll}>
        <CheckIcon isChecked={isAllSelected} />
        <p className="body3-medium text-gray-iron-700">전체선택</p>
      </div>

      <section className="flex-1 overflow-y-auto bg-gray-neutral-100 pb-20">
        {isLoading ? (
          <p className="p-5 text-center">불러오는 중...</p>
        ) : histories.length > 0 ? (
          <>
            {histories.map((history) => (
              <ChatHistoryItem
                key={history.chatRoomId}
                history={history}
                onToggleSelect={handleToggleSelect}
                isSelected={selectedIds.includes(history.chatRoomId!)}
              />
            ))}
            <div ref={ref} className="h-[1px]" />
            {isFetchingNextPage && <p className="p-5 text-center">더 불러오는 중...</p>}
          </>
        ) : (
          <EmptyItem />
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
