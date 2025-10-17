import { LucideChevronLeft } from 'lucide-react'

import { cn } from '@/shared/lib/cn'
import { useGoBack } from '@/shared/navigation/use-go-back'

import type { ReactNode } from 'react'

interface DetailHeaderBarProps {
  title?: string
  right?: ReactNode
  left?: ReactNode
  showBackButton?: boolean
  onBackClick?: () => void
  className?: string
}

export function DetailHeaderBar({
  title,
  right,
  left,
  onBackClick,
  className,
  showBackButton = true,
}: DetailHeaderBarProps) {
  const goBack = useGoBack()

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick()
    } else {
      goBack()
    }
  }

  return (
    <header
      className={cn(
        'relative flex h-[50px] w-screen max-w-[600px] items-center justify-between bg-white py-[14px] pr-5 pl-3',
        className
      )}
    >
      <div className="z-10 flex h-[30px] w-[30px] items-center justify-center">
        {showBackButton && !left && (
          <button type="button" onClick={handleBackClick} className="p-1">
            <LucideChevronLeft className="h-[28px] w-[28px]" />
          </button>
        )}
        {left}
      </div>

      {/* Title Area */}
      {title && <h1 className="body1-semibold absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">{title}</h1>}

      {/* Right Area */}
      <div className="z-10">{right}</div>
    </header>
  )
}

interface HomeHeaderBarProps {
  title?: string
  right?: ReactNode
  className?: string
}

export function HomeHeaderBar({ title, right, className }: HomeHeaderBarProps) {
  return (
    <header
      className={cn('flex h-[50px] w-screen max-w-[600px] items-center justify-between bg-white px-5 py-4', className)}
    >
      {title && <h1 className="heading2-bold">{title}</h1>}

      <div>{right}</div>
    </header>
  )
}
