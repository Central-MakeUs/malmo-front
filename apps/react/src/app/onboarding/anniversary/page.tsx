import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/shared/ui'
import { TitleSection } from '@/features/onboarding/ui/title-section'
import { useOnboardingNavigation } from '@/features/onboarding/hooks/use-onboarding-navigation'
import { useOnboarding } from '@/features/onboarding/contexts/onboarding-context'
import { useAnniversary, DatePicker } from '@/features/anniversary'
import { DetailHeaderBar } from '@/shared/components/header-bar'

export const Route = createFileRoute('/onboarding/anniversary/')({
  component: AnniversaryPage,
})

function AnniversaryPage() {
  const { goToNextStep, goToPreviousStep } = useOnboardingNavigation()
  const { data, updateAnniversary } = useOnboarding()

  const { state, actions } = useAnniversary(data.anniversary)

  const handlePrevious = () => {
    // 현재 보이는 날짜로 업데이트 후 이전 페이지로 이동
    const currentVisibleDate = new Date(state.visibleYear, state.visibleMonth - 1, state.visibleDay)
    updateAnniversary(currentVisibleDate)
    goToPreviousStep()
  }

  const handleNext = () => {
    // 현재 보이는 날짜로 최종 선택하고 다음 페이지로 이동
    const finalDate = new Date(state.visibleYear, state.visibleMonth - 1, state.visibleDay)
    updateAnniversary(finalDate)
    goToNextStep()
  }

  return (
    <div className="flex h-screen w-full flex-col bg-white">
      {/* 헤더 및 타이틀 */}
      <DetailHeaderBar onBackClick={handlePrevious} />
      <TitleSection
        title={
          <>
            둘의 만남을 시작한 날짜는
            <br />
            언제인가요?
          </>
        }
      />

      {/* 날짜 선택 */}
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

      {/* 다음 버튼 */}
      <div className="mt-auto mb-10 px-5">
        <Button text="다음" onClick={handleNext} />
      </div>
    </div>
  )
}
