import Summary from '@/assets/icons/summary.svg'

interface ChatResultSummarySectionProps {
  title: string
  content: string
}

export function ChatResultSummarySection({ title, content }: ChatResultSummarySectionProps) {
  return (
    <div className="flex flex-col gap-9">
      <div className="flex items-center gap-2">
        <Summary className="h-6 w-6" />
        <h2 className="body1-semibold">{title}</h2>
      </div>
      <div className="rounded-[10px] bg-gray-100 px-5 py-4">
        <p className="body2-reading-regular">{content}</p>
      </div>
    </div>
  )
}
