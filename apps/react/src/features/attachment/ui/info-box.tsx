import CheckIcon from '@/assets/icons/check.svg'

interface InfoBoxProps {
  children: React.ReactNode
}

export function InfoBox({ children }: InfoBoxProps) {
  return (
    <div className="flex items-start rounded-lg bg-gray-neutral-50 px-[12px] py-[8px]">
      <CheckIcon className="h-[20px] w-[20px] flex-shrink-0" />
      <p className="body2-regular ml-[4px] text-gray-iron-900">{children}</p>
    </div>
  )
}
