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
  description: string
}[] = [
  { value: '썸', label: '썸', description: '설레는 중이에요' },
  { value: '커플', label: '커플', description: '연인이 있어요' },
  { value: '이별', label: '이별', description: '헤어졌어요' },
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
              현재 연애 상태가
              <br />
              어떻게 되시나요?
            </>
          }
          description="더 정확한 상담을 위해 알려주세요"
        />

        <div className="mt-[48px] space-y-3 px-5">
          {RELATIONSHIP_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={cn(
                'flex w-full items-center rounded-[12px] border-2 p-4 transition-all',
                selected === option.value
                  ? 'border-malmo-rasberry-500 bg-malmo-rasberry-50'
                  : 'border-gray-neutral-200 bg-white'
              )}
            >
              <div className="text-left">
                <p className="body1-semibold text-gray-iron-950">{option.label}</p>
                <p className="body3-medium text-gray-iron-500">{option.description}</p>
              </div>
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
