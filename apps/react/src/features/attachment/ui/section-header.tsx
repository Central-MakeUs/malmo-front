import StarSparkleIcon from '@/assets/icons/star-sparkle.svg'

interface SectionHeaderProps {
  title: string
}

export function SectionHeader({ title }: SectionHeaderProps) {
  return (
    <div className="flex items-center">
      <StarSparkleIcon className="h-[24px] w-[24px]" />
      <h2 className="heading2-bold ml-[8px] text-[#1B1B1B]">{title}</h2>
    </div>
  )
}
