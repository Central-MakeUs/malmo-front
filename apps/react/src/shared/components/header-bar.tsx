import type { ReactNode } from 'react'
import { LucideChevronLeft } from 'lucide-react'
import { useRouter } from '@tanstack/react-router'

interface DetailHeaderBarProps {
  title?: string
  right?: ReactNode
  onBackClick?: () => void
  showBackButton?: boolean // 뒤로가기 버튼 표시 여부
}

export function DetailHeaderBar({ title, right, onBackClick, showBackButton = true }: DetailHeaderBarProps) {
  const router = useRouter()

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick()
    } else {
      router.history.back()
    }
  }

  return (
    <header className="relative flex h-[50px] w-screen max-w-[600px] items-center justify-between bg-white pr-5 pl-3">
      {/* Left Area */}
      <div className="z-10 flex h-[30px] w-[30px] items-center justify-center">
        {showBackButton && (
          <button type="button" onClick={handleBackClick} className="p-1">
            <LucideChevronLeft className="h-[28px] w-[28px]" />
          </button>
        )}
      </div>

      {/* Title Area */}
      {title && (
        <h1 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-lg font-semibold">{title}</h1>
      )}

      {/* Right Area */}
      <div className="z-10">{right}</div>
    </header>
  )
}
