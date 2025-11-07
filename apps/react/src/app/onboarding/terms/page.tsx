import { createFileRoute, useNavigate } from '@tanstack/react-router'

import { useAuth } from '@/features/auth'
import { useOnboarding } from '@/features/onboarding/contexts/onboarding-context'
import { useOnboardingNavigation } from '@/features/onboarding/hooks/use-onboarding-navigation'
import { TitleSection } from '@/features/onboarding/ui/title-section'
import { useTerms, TermsAgreementList, TermsContentModal } from '@/features/term'
import { wrapWithTracking } from '@/shared/analytics'
import { BUTTON_NAMES, CATEGORIES } from '@/shared/analytics/constants'
import { Screen } from '@/shared/layout/screen'
import { Button } from '@/shared/ui'
import { DetailHeaderBar } from '@/shared/ui/header-bar'
import { PageLoadingFallback } from '@/shared/ui/loading-fallback'

export const Route = createFileRoute('/onboarding/terms/')({
  component: TermsPage,
})

function TermsPage() {
  const auth = useAuth()
  const navigate = useNavigate()
  const { goToNextStep } = useOnboardingNavigation()
  const { data, updateTermsAgreements } = useOnboarding()

  const {
    terms,
    selectedTermId,
    selectedTermContent,
    agreements,
    isAllRequiredChecked,
    handleShowTerms,
    handleCloseTerms,
    handleAllAgreements,
    handleAgreement,
    isLoading,
  } = useTerms(data.termsAgreements)

  if (isLoading) {
    return <PageLoadingFallback />
  }

  // 다음 단계로 이동
  const handleNext = wrapWithTracking(BUTTON_NAMES.NEXT_TERMS, CATEGORIES.ONBOARDING, () => {
    if (isAllRequiredChecked) {
      // 다음 단계로 이동하기 전에 약관 동의 상태 업데이트
      updateTermsAgreements(agreements)
      goToNextStep()
    }
  })

  const handleBack = wrapWithTracking(BUTTON_NAMES.BACK_TERMS, CATEGORIES.ONBOARDING, async () => {
    await auth.logout({ clearAll: true })
    navigate({ to: '/login' })
  })

  return (
    <Screen>
      {selectedTermId !== null && selectedTermContent && (
        <TermsContentModal
          title={selectedTermContent.title || ''}
          details={selectedTermContent.details || null}
          onClose={handleCloseTerms}
        />
      )}

      <Screen.Header behavior="overlay">
        <DetailHeaderBar onBackClick={handleBack} />
      </Screen.Header>

      <Screen.Content className="flex flex-1 flex-col bg-white pb-[var(--safe-bottom)]">
        <TitleSection
          title={
            <p>
              서비스 이용 약관에 <br /> 동의해주세요
            </p>
          }
        />

        <TermsAgreementList
          terms={terms}
          agreements={agreements}
          onAllAgreementChange={handleAllAgreements}
          onAgreementChange={handleAgreement}
          onShowTerms={handleShowTerms}
        />

        <div className="mt-auto mb-5 px-5">
          <Button text="다음" disabled={!isAllRequiredChecked} onClick={handleNext} />
        </div>
      </Screen.Content>
    </Screen>
  )
}
