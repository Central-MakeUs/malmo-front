import { createFileRoute } from '@tanstack/react-router'

import { useOnboarding } from '@/features/onboarding/contexts/onboarding-context'
import { useOnboardingNavigation } from '@/features/onboarding/hooks/use-onboarding-navigation'
import { MbtiForm } from '@/features/onboarding/ui/mbti-form'

export const Route = createFileRoute('/onboarding/mbti/')({
  component: MbtiPage,
})

function MbtiPage() {
  const { goToNextStep, goToPreviousStep } = useOnboardingNavigation()
  const { data, updatePersonalityType } = useOnboarding()

  return (
    <MbtiForm
      title={
        <>
          나의 MBTI 성향은
          <br />
          무엇인가요?
        </>
      }
      initialValue={data.personalityType}
      submitText="다음"
      onSubmit={(mbti) => {
        updatePersonalityType(mbti)
        goToNextStep()
      }}
      onBack={(mbti) => {
        if (mbti) {
          updatePersonalityType(mbti)
        }
        goToPreviousStep()
      }}
    />
  )
}
