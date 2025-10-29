import { createFileRoute } from '@tanstack/react-router'

import { useAnniversary, DatePicker } from '@/features/anniversary'
import { useOnboarding } from '@/features/onboarding/contexts/onboarding-context'
import { useOnboardingNavigation } from '@/features/onboarding/hooks/use-onboarding-navigation'
import { TitleSection } from '@/features/onboarding/ui/title-section'
import { wrapWithTracking } from '@/shared/analytics'
import { BUTTON_NAMES, CATEGORIES } from '@/shared/analytics/constants'
import { Screen } from '@/shared/layout/screen'
import { Button } from '@/shared/ui'
import { DetailHeaderBar } from '@/shared/ui/header-bar'

export const Route = createFileRoute('/onboarding/anniversary/')({
  component: AnniversaryPage,
})

function AnniversaryPage() {
  const { goToNextStep } = useOnboardingNavigation()
  const { data, updateAnniversary } = useOnboarding()

  const { state, actions } = useAnniversary(data.anniversary)

  // const handlePrevious = wrapWithTracking(BUTTON_NAMES.BACK_ANNIVERSARY, CATEGORIES.ONBOARDING, () => {
  //   // 현재 보이는 날짜로 업데이트 후 이전 페이지로 이동
  //   const currentVisibleDate = new Date(state.visibleYear, state.visibleMonth - 1, state.visibleDay)
  //   updateAnniversary(currentVisibleDate)
  //   goToPreviousStep()
  // })

  const handleNext = wrapWithTracking(BUTTON_NAMES.NEXT_ANNIVERSARY, CATEGORIES.ONBOARDING, () => {
    // 현재 보이는 날짜로 최종 선택하고 다음 페이지로 이동
    const finalDate = new Date(state.visibleYear, state.visibleMonth - 1, state.visibleDay)
    updateAnniversary(finalDate)
    goToNextStep()
  })

  return (
    <Screen>
      <Screen.Header behavior="overlay">
        <DetailHeaderBar showBackButton={false} />
      </Screen.Header>

      <Screen.Content className="flex flex-1 flex-col bg-white pb-[var(--safe-bottom)]">
        <TitleSection
          title={
            <>
              둘의 만남을 시작한 날짜는
              <br />
              언제인가요?
            </>
          }
          description={'말모가 기념일을 기억하고 보여드릴게요!'}
        />

        <div className="mt-[68px] px-5">
          <DatePicker
            state={state}
            actions={{
              handleYearScroll: actions.handleYearScroll,
              handleMonthScroll: actions.handleMonthScroll,
              handleDayScroll: actions.handleDayScroll,
              handleDateChange: actions.handleDateChange,
            }}
          />
        </div>

        <div className="mt-auto mb-5 px-5">
          <Button text="다음" onClick={handleNext} />
        </div>
      </Screen.Content>
    </Screen>
  )
}
