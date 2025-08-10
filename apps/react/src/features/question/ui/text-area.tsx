import { cn } from '@/shared/lib/cn'

interface CustomTextareaProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  maxLength: number
}

function CustomTextarea({ value, onChange, maxLength }: CustomTextareaProps) {
  const placeholderText = '여기에 답변을 적어주세요.\n모모가 답변 내용을 기억해서 상담해 드려요.'
  const commonStyles =
    'w-full body2-reading-regular whitespace-pre-line rounded-lg text-base leading-relaxed resize-none'

  return (
    <div className="relative flex w-full flex-col gap-2">
      <div
        className={cn(
          commonStyles,
          'pointer-events-none absolute top-0 left-0 text-gray-400',
          value ? 'invisible' : 'visible'
        )}
        aria-hidden="true"
      >
        {placeholderText}
      </div>
      <textarea
        className={cn(commonStyles, 'h-full focus:ring-0 focus:outline-none')}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        rows={4}
      />
      <p className="label1-medium pointer-events-none text-end text-gray-500">
        {value.length}/{maxLength}
      </p>
    </div>
  )
}

export default CustomTextarea
