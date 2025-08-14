import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'

import { useAuth } from '@/features/auth'
import { useMyPageMenu, ProfileSection, StatsSection, MenuList } from '@/features/profile'
import { useTerms, TermsContentModal } from '@/features/term'
import termsService from '@/shared/services/terms.service'
import { BottomNavigation } from '@/shared/ui/bottom-navigation'
import { HomeHeaderBar } from '@/shared/ui/header-bar'
import { calculateDDay } from '@/shared/utils/date'

export const Route = createFileRoute('/my-page/')({
  component: MyPage,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(termsService.termsListQuery())
  },
})

function MyPage() {
  // 사용자 데이터
  const { userInfo, refreshUserInfo } = useAuth()

  useEffect(() => {
    void refreshUserInfo()
  }, [refreshUserInfo])

  // D-day 계산
  const dDay = calculateDDay(userInfo.startLoveDate)

  // 약관 데이터
  const { terms, selectedTermId, selectedTermContent, handleCloseTerms, handleShowTerms } = useTerms()

  // 메뉴 데이터
  const { menuItems } = useMyPageMenu(terms, handleShowTerms)

  return (
    <div className="has-bottom-nav flex h-full flex-col bg-white">
      {/* 약관 모달 */}
      {selectedTermId !== null && selectedTermContent && selectedTermContent.title && selectedTermContent.details && (
        <TermsContentModal
          title={selectedTermContent.title}
          details={selectedTermContent.details}
          onClose={handleCloseTerms}
        />
      )}

      {/* 헤더 */}
      <HomeHeaderBar title="마이페이지" />

      {/* 프로필 섹션 */}
      <ProfileSection nickname={userInfo.nickname || ''} dDay={dDay} />

      {/* 통계 박스 */}
      <StatsSection
        totalChatRoomCount={userInfo.totalChatRoomCount || 0}
        totalCoupleQuestionCount={userInfo.totalCoupleQuestionCount || 0}
      />

      {/* 메뉴 리스트 */}
      <div className="pb-[60px]">
        <MenuList menuItems={menuItems} />
      </div>

      {/* 하단 네비게이션 */}
      <BottomNavigation />
    </div>
  )
}
