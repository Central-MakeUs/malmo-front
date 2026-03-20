import { Bell, ChevronRight } from 'lucide-react'

interface KeyMessageBannerProps {
  icon?: React.ReactNode
  subtitle?: React.ReactNode
  title: string
  onClick: () => void
}

export function KeyMessageBanner({ icon, subtitle, title, onClick }: KeyMessageBannerProps) {
  return (
    <div
      className="flex cursor-pointer items-center gap-3 rounded-[10px] bg-gray-neutral-100 px-4 py-[14px]"
      onClick={onClick}
    >
      {icon && <div className="relative flex-shrink-0">{icon}</div>}

      <div className="flex flex-1 flex-col justify-center">
        {subtitle && <span className="body3-medium text-gray-iron-500">{subtitle}</span>}
        <span className="body3-semibold text-gray-iron-950">{title}</span>
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
      <Bell className="h-8 w-8 text-amber-400" fill="currentColor" />
      <span className="absolute top-[2px] right-[2px] h-[5px] w-[5px] rounded-full bg-red-500" />
    </div>
  )
}
