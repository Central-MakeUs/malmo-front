import { createFileRoute } from '@tanstack/react-router'

import { useOnboarding } from '@/features/onboarding/contexts/onboarding-context'
import { useOnboardingNavigation } from '@/features/onboarding/hooks/use-onboarding-navigation'
import { MbtiForm } from '@/features/onboarding/ui/mbti-form'

export const Route = createFileRoute('/onboarding/partner-mbti/')({
  component: PartnerMbtiPage,
})

function PartnerMbtiPage() {
  const { goToNextStep, goToPreviousStep } = useOnboardingNavigation()
  const { data, updateOtherPersonalityType } = useOnboarding()

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
      onSubmit={(mbti) => {
        updateOtherPersonalityType(mbti)
        goToNextStep()
      }}
      onBack={(mbti) => {
        if (mbti) {
          updateOtherPersonalityType(mbti)
        }
        goToPreviousStep()
      }}
    />
  )
}
