import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { TitleSection } from '@/features/onboarding/ui/title-section'
import { useOnboardingNavigation } from '@/features/onboarding/hooks/use-onboarding-navigation'
import { useOnboarding } from '@/features/onboarding/contexts/onboarding-context'
import { useTerms, TermsAgreementList, TermsContentModal } from '@/features/term'
import { Button } from '@/shared/ui'
import termsService from '@/shared/services/terms.service'
import { DetailHeaderBar } from '@/shared/components/header-bar'

export const Route = createFileRoute('/onboarding/terms/')({
  component: TermsPage,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(termsService.termsListQuery())
  },
})

function TermsPage() {
  const navigate = useNavigate()
  const { goToNextStep, goToPreviousStep } = useOnboardingNavigation()
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
  } = useTerms(data.termsAgreements)

  // 다음 단계로 이동
  const handleNext = () => {
    if (isAllRequiredChecked) {
      // 다음 단계로 이동하기 전에 약관 동의 상태 업데이트
      updateTermsAgreements(agreements)
      goToNextStep()
    }
  }

  return (
    <div className="flex h-screen w-full flex-col bg-white">
      {/* 약관 전체화면 */}
      {selectedTermId !== null && selectedTermContent && (
        <TermsContentModal
          title={selectedTermContent.title || ''}
          details={selectedTermContent.details || null}
          onClose={handleCloseTerms}
        />
      )}

      {/* 헤더 및 타이틀 */}
      <DetailHeaderBar onBackClick={() => navigate({ to: '/login' })} />
      <TitleSection title="서비스 이용 약관에 동의해주세요" />

      {/* 약관 동의 섹션 */}
      <TermsAgreementList
        terms={terms}
        agreements={agreements}
        onAllAgreementChange={handleAllAgreements}
        onAgreementChange={handleAgreement}
        onShowTerms={handleShowTerms}
      />

      {/* 다음 버튼 */}
      <div className="mt-auto mb-10 px-5">
        <Button text="다음" disabled={!isAllRequiredChecked} onClick={handleNext} />
      </div>
    </div>
  )
}
