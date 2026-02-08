import { Link } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'

import CheckedCircle from '@/assets/icons/checked-circle.svg'
import { wrapWithTracking } from '@/shared/analytics'
import { BUTTON_NAMES, CATEGORIES } from '@/shared/analytics/constants'
import { CHAT_ROOM_STATE, ChatRoomListItem } from '@/shared/types/chat'
import { formatDate } from '@/shared/utils'

// 공통 UI를 Base 컴포넌트로 추출
const ChatHistoryItemBase = ({ history }: { history: ChatRoomListItem }) => {
  const title = history.title === null ? '대화를 더 나누면 제목이 생성돼요' : (history.title ?? '대화 기록')
  const timestamp = history.lastMessageSentTime ?? history.createdAt

  return (
    <>
      <div className="flex-1">
        <div className="mb-[10px]" />
        <div className="pl-1">
          <p className="label1-medium text-gray-iron-500">
            {timestamp ? formatDate(timestamp, 'YYYY년 MM월 DD일') : ''}
          </p>
          <p className="body1-semibold break-keep">{title}</p>
        </div>
      </div>
    </>
  )
}

// '대화 기록' 페이지용 링크 아이템
export const LinkedChatHistoryItem = ({ history }: { history: ChatRoomListItem }) => {
  const chatRoomId = history.chatRoomId

  if (!chatRoomId) return null

  const handleClick = wrapWithTracking(BUTTON_NAMES.SELECT_HISTORY, CATEGORIES.MAIN)
  const isCompleted = history.chatRoomState === CHAT_ROOM_STATE.Completed
  const targetPath = isCompleted ? '/chat/result' : '/chat'

  return (
    <Link
      className="flex items-center justify-between gap-16 bg-white px-5 pt-6 pb-7"
      to={targetPath}
      search={{ chatId: chatRoomId, fromHistory: true, title: history.title ?? undefined }}
      onClick={handleClick}
    >
      <ChatHistoryItemBase history={history} />
      <ChevronRight className="text-gray-iron-700" size={24} />
    </Link>
  )
}

// '삭제' 페이지용 선택 가능 아이템
export const CheckIcon = ({ isChecked }: { isChecked: boolean }) =>
  isChecked ? (
    <CheckedCircle className="h-[22px] w-[22px]" />
  ) : (
    <div className="h-[22px] w-[22px] rounded-full border border-gray-iron-400" />
  )

export const SelectableChatHistoryItem = ({
  history,
  isSelected,
  onToggleSelect,
}: {
  history: ChatRoomListItem
  isSelected: boolean
  onToggleSelect: (id?: number) => void
}) => (
  <div
    className="mb-[6px] flex cursor-pointer items-center justify-between bg-white px-5 py-6"
    onClick={() => onToggleSelect(history.chatRoomId)}
  >
    <div className="flex items-center gap-5 pr-[40px]">
      <CheckIcon isChecked={isSelected} />
      <div className="flex-1">
        <ChatHistoryItemBase history={history} />
      </div>
    </div>
  </div>
)

// 일반화된 빈 상태 컴포넌트
interface EmptyStateProps {
  image: string
  title: string
  description: string
  className?: string
}

export const EmptyState = ({ image, title, description, className }: EmptyStateProps) => (
  <div className={`flex h-full -translate-y-[60px] flex-col items-center justify-center ${className || ''}`}>
    <div className="mx-auto mb-5 h-[220px] w-full px-7">
      <img
        src={image}
        alt="Empty State"
        loading="eager"
        decoding="async"
        className="h-full w-full object-contain"
        draggable={false}
      />
    </div>
    <div className="text-center">
      <p className="heading1-bold mb-1">{title}</p>
      <p className="body2-medium text-gray-iron-500">{description}</p>
    </div>
  </div>
)
