// @deprecated 온보딩 플로우에서 제거됨. 사용하지 않을 시 삭제
import { createFileRoute } from '@tanstack/react-router'

import { useOnboarding } from '@/features/onboarding/contexts/onboarding-context'
import { useOnboardingNavigation } from '@/features/onboarding/hooks/use-onboarding-navigation'
import { MbtiForm } from '@/features/onboarding/ui/mbti-form'
import { wrapWithTracking } from '@/shared/analytics'
import { BUTTON_NAMES, CATEGORIES } from '@/shared/analytics/constants'

export const Route = createFileRoute('/onboarding/partner-mbti/')({
  component: PartnerMbtiPage,
})

function PartnerMbtiPage() {
  const { goToNextStep, goToPreviousStep } = useOnboardingNavigation()
  const { data, updateOtherPersonalityType } = useOnboarding()

  const handleNext = wrapWithTracking(BUTTON_NAMES.NEXT_PARTNER_MBTI, CATEGORIES.ONBOARDING, (mbti: string) => {
    updateOtherPersonalityType(mbti)
    goToNextStep()
  })

  const handleBack = wrapWithTracking(BUTTON_NAMES.BACK_PARTNER_MBTI, CATEGORIES.ONBOARDING, (mbti: string | null) => {
    if (mbti) {
      updateOtherPersonalityType(mbti)
    }
    goToPreviousStep()
  })

  return (
    <MbtiForm
      title={
        <>
          상대방 MBTI 성향은
          <br />
          무엇인가요?
        </>
      }
      initialValue={data.otherPersonalityType}
      submitText="다음"
      onSubmit={handleNext}
      onBack={handleBack}
    />
  )
}
