import { createFileRoute } from '@tanstack/react-router'
import { Button, HeaderNavigation } from '@/shared/ui'
import { TitleSection } from '@/features/onboarding/ui/title-section'
import { useOnboardingNavigation } from '@/features/onboarding/hooks/use-onboarding-navigation'
import { useOnboarding } from '@/features/onboarding/contexts/onboarding-context'
import { useAnniversary, DatePicker } from '@/features/anniversary'

export const Route = createFileRoute('/onboarding/anniversary/')({
  component: AnniversaryPage,
})

function AnniversaryPage() {
  const { goToNextStep, goToPreviousStep } = useOnboardingNavigation()
  const { data, updateAnniversary } = useOnboarding()

  const { state, actions } = useAnniversary(data.anniversary)

  const handlePrevious = () => {
    // 이전 페이지로 이동하기 전에 현재 선택된 날짜 저장
    updateAnniversary(state.selectedDate)
    goToPreviousStep()
  }

  const handleNext = () => {
    // 현재 보이는 날짜로 최종 선택
    const finalDate = actions.handleSelectDate()
    // 온보딩 컨텍스트 업데이트
    updateAnniversary(finalDate || state.selectedDate)
    // 다음 페이지로 이동
    goToNextStep()
  }

  return (
    <div className="flex h-screen w-full flex-col bg-white">
      {/* 헤더 및 타이틀 */}
      <HeaderNavigation onBack={handlePrevious} />
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
