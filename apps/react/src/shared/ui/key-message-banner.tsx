import { ChevronRight } from 'lucide-react'

import BellSvg from '@/assets/icons/bell.svg'

interface KeyMessageBannerProps {
  icon?: React.ReactNode
  subtitle?: React.ReactNode
  title: string
  onClick: () => void
}

export function KeyMessageBanner({ icon, subtitle, title, onClick }: KeyMessageBannerProps) {
  return (
    <div
      className="flex cursor-pointer items-center rounded-[10px] bg-gray-neutral-100 py-[14px] pr-6 pl-5"
      onClick={onClick}
    >
      {icon && <div className="relative flex-shrink-0 pr-[22px]">{icon}</div>}

      <div className="flex flex-1 flex-col justify-center">
        {subtitle && <span className="body4-medium text-gray-iron-500">{subtitle}</span>}
        <span className="body2-semibold text-gray-iron-950">{title}</span>
      </div>

      <div
        className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gray-iron-700 ${icon ? 'outline-[5px] outline-gray-neutral-300' : ''}`}
      >
        <ChevronRight className="h-[18px] w-[18px] text-white" />
      </div>
    </div>
  )
}

export function BellNotificationIcon() {
  return (
    <div className="relative">
      <BellSvg width={36} height={36} />
    </div>
  )
}
