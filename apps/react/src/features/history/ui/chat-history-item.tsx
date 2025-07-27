import { Link } from '@tanstack/react-router'
import { GetChatRoomListResponse } from '@data/user-api-axios/api'
import { formatDate } from '@/shared/utils'
import { ChevronRight } from 'lucide-react'
import CheckedCircle from '@/assets/icons/checked-circle.svg'

// 1. 공통 UI를 Base 컴포넌트로 추출
const ChatHistoryItemBase = ({ history }: { history: GetChatRoomListResponse }) => (
  <>
    <div className="flex-1">
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
        <p className="body1-semibold break-keep">{history.totalSummary}</p>
      </div>
    </div>
  </>
)

// 2. '대화 기록' 페이지용 링크 아이템
export const LinkedChatHistoryItem = ({ history }: { history: GetChatRoomListResponse }) => (
  <Link
    className="mb-[6px] flex items-center justify-between gap-16 bg-white px-5 py-6"
    to={'/chat/result'}
    search={{ chatId: history.chatRoomId, fromHistory: true }}
  >
    <ChatHistoryItemBase history={history} />
    <ChevronRight size={24} />
  </Link>
)

// 3. '삭제' 페이지용 선택 가능 아이템
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
  history: GetChatRoomListResponse
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

// 4. 일반화된 EmptyState 컴포넌트
interface EmptyStateProps {
  image: string
  title: string
  description: string
  className?: string
}

export const EmptyState = ({ image, title, description, className }: EmptyStateProps) => (
  <div className={className}>
    <img src={image} alt="Empty State" className="mb-5 px-7" />
    <div className="text-center">
      <p className="heading1-bold mb-1">{title}</p>
      <p className="body2-medium text-gray-iron-500">{description}</p>
    </div>
  </div>
)
