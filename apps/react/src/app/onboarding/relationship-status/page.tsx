import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

import { useOnboarding, type RelationshipStatus } from '@/features/onboarding/contexts/onboarding-context'
import { useOnboardingNavigation } from '@/features/onboarding/hooks/use-onboarding-navigation'
import { TitleSection } from '@/features/onboarding/ui/title-section'
import { Screen } from '@/shared/layout/screen'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/shared/ui'
import { DetailHeaderBar } from '@/shared/ui/header-bar'

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
  const { goToNextStep, goToPreviousStep } = useOnboardingNavigation()
  const { data, updateRelationshipStatus } = useOnboarding()
  const [selected, setSelected] = useState<RelationshipStatus | null>(data.relationshipStatus)

  const handleSelect = (status: RelationshipStatus) => {
    setSelected(status)
  }

  const handleNext = () => {
    if (selected) {
      updateRelationshipStatus(selected)
      goToNextStep()
    }
  }

  const handlePrevious = () => {
    if (selected) {
      updateRelationshipStatus(selected)
    }
    goToPreviousStep()
  }

  return (
    <Screen>
      <Screen.Header behavior="overlay">
        <DetailHeaderBar onBackClick={handlePrevious} />
      </Screen.Header>

      <Screen.Content className="flex flex-1 flex-col bg-white">
        <TitleSection
          title={
            <>
              현재 연애 상태를
              <br />
              선택해 주세요
            </>
          }
          description="이후에 관계 정보가 바뀌면 변경할 수 있어요"
        />

        <div className="mt-[68px] space-y-2 px-5">
          {RELATIONSHIP_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={cn(
                'flex w-full items-center rounded-[10px] border-1 px-5 py-4 text-left transition-all',
                selected === option.value ? 'border-malmo-rasberry-500' : 'border-gray-neutral-300'
              )}
            >
              <p
                className={cn(
                  'body2-medium',
                  selected === option.value ? 'text-malmo-rasberry-500' : 'text-gray-iron-500'
                )}
              >
                {option.label}
              </p>
            </button>
          ))}
        </div>

        <div className="mt-auto mb-5 px-5 pb-[var(--safe-bottom)]">
          <Button text="다음" onClick={handleNext} disabled={!selected} />
        </div>
      </Screen.Content>
    </Screen>
  )
}
