import { createFileRoute } from '@tanstack/react-router'
import { BottomNavigation } from '@/shared/ui/bottom-navigation'
import { useAuth } from '@/features/auth'
import { calculateDDay } from '@/shared/utils/date'
import { useTerms, TermsContentModal } from '@/features/term'
import { useMyPageMenu, ProfileSection, StatsSection, MenuList } from '@/features/profile'

export const Route = createFileRoute('/my-page/')({
  component: MyPage,
})

function MyPage() {
  // 사용자 데이터
  const { userInfo } = useAuth()

  // D-day 계산
  const dDay = calculateDDay(userInfo.startLoveDate)

  // 약관 데이터
  const { selectedTermId, selectedTermContent, handleCloseTerms } = useTerms()

  // 메뉴 데이터
  const { menuItems } = useMyPageMenu()

  return (
    <div className="min-h-screen bg-white pb-[60px]">
      {/* 약관 모달 */}
      {selectedTermId !== null && selectedTermContent && (
        <TermsContentModal
          title={selectedTermContent.title || ''}
          content={selectedTermContent.content || ''}
          onClose={handleCloseTerms}
        />
      )}

      {/* 헤더 */}
      <header className="flex h-[60px] items-center px-5">
        <h1 className="heading2-bold text-gray-iron-950">마이페이지</h1>
      </header>

      {/* 프로필 섹션 */}
      <ProfileSection nickname={userInfo.nickname || ''} dDay={dDay} />

      {/* 통계 박스 */}
      <StatsSection
        totalChatRoomCount={userInfo.totalChatRoomCount || 0}
        totalCoupleQuestionCount={userInfo.totalCoupleQuestionCount || 0}
      />

      {/* 메뉴 리스트 */}
      <MenuList menuItems={menuItems} />

      {/* 하단 네비게이션 */}
      <BottomNavigation />
    </div>
  )
}
