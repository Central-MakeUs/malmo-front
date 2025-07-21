import type { ReactNode } from 'react'
import { LucideChevronLeft } from 'lucide-react'
import { useRouter } from '@tanstack/react-router'
import { cn } from '@ui/common/lib/utils'

interface DetailHeaderBarProps {
  title?: string
  right?: ReactNode
  allowBack?: boolean
  onBackClick?: () => void
  className?: string
}

export function DetailHeaderBar({ title, right, onBackClick, allowBack = true, className }: DetailHeaderBarProps) {
  showBackButton?: boolean // 뒤로가기 버튼 표시 여부
}
  const router = useRouter()

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick()
    } else {
      router.history.back()
    }
  }

  return (
    <header
      className={cn(
        'relative flex h-[50px] w-screen max-w-[600px] items-center justify-between bg-white py-[14px] pr-5 pl-3',
        className
      )}
    >
      {/* Left Area */}
      {allowBack ? (
        <button type="button" onClick={handleBackClick} className="z-10 p-1">
          <LucideChevronLeft className="h-[28px] w-[28px]" />
        </button>
      ) : (
        <div />
      )}
      
      <div className="z-10 flex h-[30px] w-[30px] items-center justify-center">
        {showBackButton && (
          <button type="button" onClick={handleBackClick} className="p-1">
            <LucideChevronLeft className="h-[28px] w-[28px]" />
          </button>
        )}
      </div>

      {/* Title Area */}
      {title && <h1 className="body2-semibold absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">{title}</h1>}

      {/* Right Area */}
      <div className="z-10">{right}</div>
    </header>
  )
}
