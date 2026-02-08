import { ArrowDown, Bookmark } from 'lucide-react'

import { cn } from '@/shared/lib/cn'

type ChatFloatingActionsProps = {
  isAtBottom: boolean
  onBookmarkClick: () => void
  onScrollToBottom: () => void
}

export function ChatFloatingActions({ isAtBottom, onBookmarkClick, onScrollToBottom }: ChatFloatingActionsProps) {
  return (
    <>
      {!isAtBottom && (
        <button
          type="button"
          aria-label="맨 아래로 이동"
          className="absolute -top-[54px] right-0 z-10 flex h-10 w-10 items-center justify-center rounded-[26px] border border-[#E5E7EB] bg-white shadow-[1px_2px_8px_0px_#00000014]"
          onClick={onScrollToBottom}
        >
          <ArrowDown className="h-6 w-6 text-gray-iron-700" />
        </button>
      )}
      <button
        type="button"
        aria-label="북마크"
        className={cn(
          'absolute right-0 z-10 flex h-10 w-10 items-center justify-center rounded-[26px] bg-gray-iron-700 shadow-[1px_2px_8px_0px_#00000014]',
          isAtBottom ? '-top-[54px]' : '-top-[100px]'
        )}
        onClick={onBookmarkClick}
      >
        <Bookmark className="h-5 w-5 text-white" fill="currentColor" />
      </button>
    </>
  )
}
