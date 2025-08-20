import ChatIcon from '@/assets/icons/chat-gray.svg'
import LikeIcon from '@/assets/icons/like-gray.svg'

interface StatsSectionProps {
  totalChatRoomCount: number
  totalCoupleQuestionCount: number
}

export function StatsSection({ totalChatRoomCount, totalCoupleQuestionCount }: StatsSectionProps) {
  return (
    <div className="mt-5 px-5">
      <div className="rounded-xl bg-gray-neutral-100 pt-4 pb-5">
        <div className="relative flex items-center justify-center">
          {/* 가운데 세로 구분선 */}
          <div className="absolute left-1/2 h-[36px] w-px -translate-x-1/2 bg-gray-iron-300"></div>

          {/* 대화 통계 */}
          <div className="flex w-1/2 flex-col items-center justify-center">
            <p className="body4-medium text-gray-iron-500">지금까지 모은 대화</p>
            <div className="mt-2 flex items-center">
              <ChatIcon className="h-6 w-6" />
              <span className="heading1-bold ml-1 text-gray-iron-950">{totalChatRoomCount || 0}</span>
            </div>
          </div>

          {/* 마음 통계 */}
          <div className="flex w-1/2 flex-col items-center justify-center">
            <p className="body4-medium text-gray-iron-500">지금까지 모은 마음</p>
            <div className="mt-2 flex items-center">
              <LikeIcon className="h-6 w-6" />
              <span className="heading1-bold ml-1 text-gray-iron-950">{totalCoupleQuestionCount || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
