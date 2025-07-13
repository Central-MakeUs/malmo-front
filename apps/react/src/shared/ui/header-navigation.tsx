import { ChevronLeft } from 'lucide-react'

interface HeaderNavigationProps {
  onBack: () => void
}

export function HeaderNavigation({ onBack }: HeaderNavigationProps) {
  const handleBack = () => {
    onBack()
  }

  return (
    <>
      {/* 헤더 */}
      <div className="flex h-[50px] items-center px-5">
        <button onClick={handleBack} className="flex h-7 w-7 items-center justify-center">
          <ChevronLeft className="h-7 w-7 text-gray-iron-950" />
        </button>
      </div>
    </>
  )
}
