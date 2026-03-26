import { createFileRoute } from '@tanstack/react-router'

import { useOnboarding, type RelationshipStatus } from '@/features/onboarding/contexts/onboarding-context'
import { useOnboardingNavigation } from '@/features/onboarding/hooks/use-onboarding-navigation'
import { RelationshipStatusForm } from '@/features/onboarding/ui/relationship-status-form'
import { wrapWithTracking } from '@/shared/analytics'
import { BUTTON_NAMES, CATEGORIES } from '@/shared/analytics/constants'

export const Route = createFileRoute('/onboarding/relationship-status/')({
  component: RelationshipStatusPage,
})

const RELATIONSHIP_OPTIONS: {
  value: RelationshipStatus
  label: string
}[] = [
  { value: 'SEEING_SOMEONE', label: '썸을 타고 있거나, 관계가 진전되기 전이에요' },
  { value: 'IN_RELATIONSHIP', label: '연애 중이에요' },
  { value: 'BREAKUP', label: '이별했어요' },
]

function RelationshipStatusPage() {
  const { goToPreviousStep, completeAndGoHome } = useOnboardingNavigation()
  const { data, updateRelationshipStatus } = useOnboarding()

  const handleNext = wrapWithTracking(
    BUTTON_NAMES.NEXT_RELATIONSHIP_STATUS,
    CATEGORIES.ONBOARDING,
    async (value: string) => {
      updateRelationshipStatus(value as RelationshipStatus)
      await completeAndGoHome(value as RelationshipStatus)
    }
  )

  const handleBack = wrapWithTracking(
    BUTTON_NAMES.BACK_RELATIONSHIP_STATUS,
    CATEGORIES.ONBOARDING,
    (value: string | null) => {
      if (value) {
        updateRelationshipStatus(value as RelationshipStatus)
      }
      goToPreviousStep()
    }
  )

  return (
    <RelationshipStatusForm
      title={
        <>
          현재 연애 상태를
          <br />
          선택해 주세요
        </>
      }
      description="이후에 관계 정보가 바뀌면 변경할 수 있어요"
      options={RELATIONSHIP_OPTIONS}
      initialValue={data.relationshipStatus}
      submitText="시작하기"
      onSubmit={handleNext}
      onBack={handleBack}
    />
  )
}
