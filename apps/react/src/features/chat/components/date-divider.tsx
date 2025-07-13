import { formatDate } from '../util/chat-format'

interface DateDividerProps {
  currentTimestamp: string
  previousTimestamp?: string
}

export function DateDivider({ currentTimestamp, previousTimestamp }: DateDividerProps) {
  if (!previousTimestamp) {
    return (
      <div className="mx-auto w-fit rounded-[30px] bg-gray-100 px-[14px] py-[6px]">
        <p className="label1-medium text-gray-500">{formatDate(currentTimestamp)}</p>
      </div>
    )
  }

  const currentDate = new Date(currentTimestamp).toDateString()
  const previousDate = new Date(previousTimestamp).toDateString()

  if (currentDate !== previousDate) {
    return (
      <div className="mx-auto w-fit rounded-[30px] bg-gray-100 px-[14px] py-[6px]">
        <p className="label1-medium font-medium text-gray-500">{formatDate(currentTimestamp)}</p>
      </div>
    )
  }

  return null
}
