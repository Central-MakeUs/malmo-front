import { BookmarkDtoTypeEnum } from '@data/user-api-axios/api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

import CheckedCircle from '@/assets/icons/checked-circle.svg'
import { useScreenLayout } from '@/shared/layout/screen'
import { cn } from '@/shared/lib/cn'
import bookmarkService from '@/shared/services/bookmark.service'
import { queryKeys } from '@/shared/services/query-keys'
import { Button } from '@/shared/ui'
import { Sheet, SheetContent, SheetTitle } from '@/shared/ui/sheet'
import { formatDate } from '@/shared/utils/date'

interface BookmarkSheetProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  chatRoomId?: number
  onSelectBookmark?: (bookmarkId: number, chatRoomId: number) => void
}

const getSenderLabel = (type?: BookmarkDtoTypeEnum) => {
  switch (type) {
    case BookmarkDtoTypeEnum.User:
      return '내가 보냄'
    case BookmarkDtoTypeEnum.Assistant:
      return '모모가 보냄'
    case BookmarkDtoTypeEnum.System:
      return '시스템'
    default:
      return ''
  }
}

export function BookmarkSheet({ isOpen, onOpenChange, chatRoomId, onSelectBookmark }: BookmarkSheetProps) {
  const layout = useScreenLayout()
  const headerHeight = layout?.headerHeight ?? 0
  const [isDeleteMode, setIsDeleteMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const queryClient = useQueryClient()

  const { data: bookmarkData } = useQuery({
    ...bookmarkService.bookmarkListQuery(chatRoomId ?? 0, { page: 0, size: 20 }),
    enabled: isOpen && !!chatRoomId,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: 'always',
  })

  const bookmarks = bookmarkData?.list ?? []
  const totalCount = bookmarkData?.totalCount ?? bookmarks.length

  const { mutateAsync: deleteBookmarks, isPending: isDeleting } = useMutation(bookmarkService.deleteBookmarksMutation())

  useEffect(() => {
    if (!isOpen) {
      setIsDeleteMode(false)
      setSelectedIds([])
    }
  }, [isOpen])

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const hasSelection = selectedIds.length > 0
  const canDelete = hasSelection && !!chatRoomId && !isDeleting
  const sheetStyle = isDeleteMode
    ? {
        top: `calc(var(--safe-top) + ${headerHeight}px)`,
        height: `calc(100vh - (var(--safe-top) + ${headerHeight}px))`,
      }
    : { height: '50vh' }

  const handleDelete = async () => {
    if (!chatRoomId || !hasSelection || isDeleting) return
    const bookmarkIdList = selectedIds.filter((id) => Number.isFinite(id))
    if (bookmarkIdList.length === 0) return
    try {
      await deleteBookmarks({ chatRoomId, bookmarkIdList })
      setSelectedIds([])
      await queryClient.invalidateQueries({ queryKey: queryKeys.bookmark.all })
    } catch {
      // handled by mutation onError
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="rounded-t-[20px] border-none p-0 [&>*:last-child]:hidden"
        style={sheetStyle}
      >
        <SheetTitle className="sr-only">북마크</SheetTitle>

        <div className={cn('relative flex h-full flex-col px-5 pt-8 pb-6', { 'pb-0': isDeleteMode })}>
          <button
            type="button"
            className="body2-medium absolute top-8 right-5 text-gray-iron-700"
            onClick={() => {
              if (isDeleteMode) {
                setIsDeleteMode(false)
                setSelectedIds([])
              } else {
                setIsDeleteMode(true)
              }
            }}
          >
            {isDeleteMode ? '완료' : '삭제'}
          </button>

          <div className="flex flex-col items-center text-center">
            <p className="heading1-bold text-gray-iron-950">북마크</p>
            <p className="body1-medium mt-1 text-gray-iron-700">
              <span className="text-malmo-rasberry-500">{totalCount}개의 메시지</span>를 저장했어요
            </p>
          </div>

          <div className="mt-7 flex min-h-0 flex-1 flex-col overflow-y-scroll" style={{ scrollbarGutter: 'stable' }}>
            {bookmarks.map((bookmark, index) => {
              const bookmarkId = bookmark.bookmarkId ?? index
              const isSelected = selectedIds.includes(bookmarkId)
              const senderLabel = getSenderLabel(bookmark.type)
              const timestamp = formatDate(bookmark.timestamp, 'YYYY년 M월 D일 HH:mm')
              return (
                <div key={bookmarkId}>
                  {isDeleteMode ? (
                    <button
                      type="button"
                      className="flex w-full items-start gap-4 text-left"
                      onClick={() => toggleSelect(bookmarkId)}
                    >
                      {isSelected ? (
                        <CheckedCircle className="mt-[2px] h-[22px] w-[22px] shrink-0" />
                      ) : (
                        <div className="mt-[2px] h-[22px] w-[22px] shrink-0 rounded-full border border-gray-iron-400" />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="body2-reading-regular truncate text-gray-iron-950">{bookmark.content}</p>
                        <p className="label1-medium mt-1 text-gray-iron-500">
                          {senderLabel} ・ {timestamp}
                        </p>
                      </div>
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="w-full text-left"
                      onClick={() => {
                        if (bookmark.bookmarkId == null || chatRoomId == null) return
                        if (!onSelectBookmark) return
                        onSelectBookmark?.(bookmark.bookmarkId, chatRoomId)
                      }}
                    >
                      <p className="body2-reading-regular truncate text-gray-iron-950">{bookmark.content}</p>
                      <p className="label1-medium mt-1 text-gray-iron-500">
                        {senderLabel} ・ {timestamp}
                      </p>
                    </button>
                  )}
                  {index < bookmarks.length - 1 && (
                    <>
                      <div className="mt-4">
                        <hr className="h-px border-0 bg-gray-iron-100" />
                      </div>
                      <div className="mt-4" />
                    </>
                  )}
                </div>
              )
            })}
          </div>

          {isDeleteMode && (
            <div className="mt-6 pb-5">
              <Button
                onClick={handleDelete}
                text={hasSelection ? `${selectedIds.length}개 삭제` : '삭제'}
                disabled={!canDelete}
                className={cn({
                  'bg-gray-iron-700': canDelete,
                  'bg-gray-neutral-300': !canDelete,
                })}
              />
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
