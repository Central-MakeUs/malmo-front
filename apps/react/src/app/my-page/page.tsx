import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'

import { useAuth } from '@/features/auth'
import { useMyPageMenu, ProfileSection, StatsSection, MenuList } from '@/features/profile'
import { useTerms, TermsContentModal } from '@/features/term'
import { Screen } from '@/shared/layout/screen'
import { BottomNavigation } from '@/shared/ui/bottom-navigation'
import { HomeHeaderBar } from '@/shared/ui/header-bar'
import { PageLoadingFallback } from '@/shared/ui/loading-fallback'
import { calculateDDay } from '@/shared/utils/date'

export const Route = createFileRoute('/my-page/')({
  component: MyPage,
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
  const { terms, selectedTermId, selectedTermContent, handleCloseTerms, handleShowTerms, isLoading } = useTerms()

  // 메뉴 데이터
  const { menuItems } = useMyPageMenu(terms, handleShowTerms)

  if (isLoading) {
    return <PageLoadingFallback />
  }

  return (
    <Screen>
      {/* 약관 모달 */}
      {selectedTermId !== null && selectedTermContent && selectedTermContent.title && selectedTermContent.details && (
        <TermsContentModal
          title={selectedTermContent.title}
          details={selectedTermContent.details}
          onClose={handleCloseTerms}
        />
      )}

      {/* 헤더 */}
      <Screen.Header>
        <HomeHeaderBar title="마이페이지" />
      </Screen.Header>

      {/* 프로필 섹션 */}
      <Screen.Content className="no-bounce-scroll has-bottom-nav flex-1 bg-white">
        <ProfileSection nickname={userInfo.nickname || ''} dDay={dDay} />

        {/* 통계 박스 */}
        <StatsSection
          totalChatRoomCount={userInfo.totalChatRoomCount || 0}
          totalCoupleQuestionCount={userInfo.totalCoupleQuestionCount || 0}
        />

        {/* 메뉴 리스트 */}
        <MenuList menuItems={menuItems} />
      </Screen.Content>

      {/* 하단 네비게이션 */}
      <BottomNavigation />
    </Screen>
  )
}
