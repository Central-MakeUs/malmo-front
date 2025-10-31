import { useAnniversary, DatePicker } from '@/features/anniversary'
import { TitleSection } from '@/features/onboarding/ui/title-section'
import { Screen } from '@/shared/layout/screen'
import { Button } from '@/shared/ui'
import { DetailHeaderBar } from '@/shared/ui/header-bar'

interface AnniversaryLayoutProps {
  anniversary: ReturnType<typeof useAnniversary>
  onSubmit: () => void
  isSubmitting: boolean
  showBackButton: boolean
  onBack?: () => void
}

export function AnniversaryLayout({
  anniversary,
  onSubmit,
  isSubmitting,
  showBackButton,
  onBack,
}: AnniversaryLayoutProps) {
  return (
    <Screen>
      <Screen.Header behavior="overlay">
        <DetailHeaderBar showBackButton={showBackButton} onBackClick={onBack} />
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
            state={anniversary.state}
            actions={{
              handleYearScroll: anniversary.actions.handleYearScroll,
              handleMonthScroll: anniversary.actions.handleMonthScroll,
              handleDayScroll: anniversary.actions.handleDayScroll,
              handleDateChange: anniversary.actions.handleDateChange,
            }}
          />
        </div>

        <div className="mt-auto mb-5 px-5">
          <Button text="다음" onClick={onSubmit} disabled={isSubmitting} />
        </div>
      </Screen.Content>
    </Screen>
  )
}
