import { createFileRoute } from '@tanstack/react-router'
import malmoLogo from '@/assets/images/malmo-logo.png'
import HeartIcon from '@/assets/icons/heart.svg'

import { BottomNavigation } from '@/shared/ui/bottom-navigation'
import { useAuth } from '@/features/auth'
import { calculateDDay } from '@/shared/utils/date'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  const { userInfo } = useAuth()

  // D-day 계산
  const dDay = calculateDDay(userInfo.startLoveDate)

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <header className="flex h-[60px] items-center justify-between px-5">
        <img src={malmoLogo} alt="말모 로고" className="h-8 w-[94px]" />

        {/* 오른쪽 - 스타트 러브 데이트 */}
        <div className="flex h-8 items-center rounded-[30px] border border-gray-iron-200 px-4 py-[5px]">
          <HeartIcon className="h-4 w-4" />
          <span className="body3-medium ml-[9px] text-gray-iron-950">D+{dDay}</span>
        </div>
      </header>

      {/* 메인 컨텐츠  */}
      <div className="mt-3 px-5"></div>

      {/* 하단 네비게이션 */}
      <BottomNavigation />
    </div>
  )
}
