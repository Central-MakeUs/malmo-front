import { formatDate, isSameCalendarDay } from '../util/chat-format'

interface DateDividerProps {
  currentTimestamp?: string
  previousTimestamp?: string
}

export function DateDivider({ currentTimestamp, previousTimestamp }: DateDividerProps) {
  if (!currentTimestamp) return null
  if (!previousTimestamp) {
    return (
      <div className="mx-auto mb-5 w-fit rounded-[30px] bg-gray-100 px-[14px] py-[6px]">
        <p className="label1-medium text-gray-500">{formatDate(currentTimestamp)}</p>
      </div>
    )
  }

  if (!isSameCalendarDay(currentTimestamp, previousTimestamp)) {
    return (
      <div className="mx-auto mb-5 w-fit rounded-[30px] bg-gray-100 px-[14px] py-[6px]">
        <p className="label1-medium font-medium text-gray-500">{formatDate(currentTimestamp)}</p>
      </div>
    )
  }

  return null
}
