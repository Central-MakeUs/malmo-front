import ChatIcon from '@/assets/icons/chat-gray.svg'
interface StatsSectionProps {
  totalChatRoomCount: number
}

export function StatsSection({ totalChatRoomCount }: StatsSectionProps) {
  return (
    <div className="mt-5 px-5">
      <div className="rounded-xl bg-gray-neutral-100 pt-4 pb-5">
        <div className="flex items-center justify-center">
          <div className="flex flex-col items-center justify-center">
            <p className="body4-medium text-gray-iron-500">지금까지 모은 대화</p>
            <div className="mt-2 flex items-center">
              <ChatIcon className="h-6 w-6" />
              <span className="heading1-bold ml-1 text-gray-iron-950">{totalChatRoomCount || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
