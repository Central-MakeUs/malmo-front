import { ChevronRight } from 'lucide-react'

interface ChatResultMainInfoProps {
  date: string
  subject: string
  onViewChat?: () => void
}

export function ChatResultMainInfo({ date, subject, onViewChat }: ChatResultMainInfoProps) {
  return (
    <div className="flex items-center gap-6">
      <div className="flex-1">
        <p className="body4-medium mb-1 text-gray-iron-500">{date}</p>
        <h1 className="heading1-bold">{subject}</h1>
      </div>
      <div
        className="flex h-fit cursor-pointer items-center rounded-[8px] bg-gray-iron-700 py-2 pr-3 pl-[18px] text-gray-iron-25"
        onClick={onViewChat}
      >
        <p className="body3-medium">대화보기</p>
        <ChevronRight className="h-4 w-4" />
      </div>
    </div>
  )
}
