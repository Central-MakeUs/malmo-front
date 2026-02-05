import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

import { useOnboarding } from '@/features/onboarding/contexts/onboarding-context'
import { useOnboardingNavigation } from '@/features/onboarding/hooks/use-onboarding-navigation'
import { TitleSection } from '@/features/onboarding/ui/title-section'
import { Screen } from '@/shared/layout/screen'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/shared/ui'
import { DetailHeaderBar } from '@/shared/ui/header-bar'

export const Route = createFileRoute('/onboarding/mbti/')({
  component: MbtiPage,
})

// MBTI 차원 타입
type EnergyType = 'E' | 'I'
type PerceptionType = 'S' | 'N'
type JudgmentType = 'T' | 'F'
type LifestyleType = 'J' | 'P'

interface MbtiSelections {
  energy: EnergyType | null
  perception: PerceptionType | null
  judgment: JudgmentType | null
  lifestyle: LifestyleType | null
}

interface MbtiDimension {
  key: keyof MbtiSelections
  title: string
  options: { value: string; label: string; description: string }[]
}

const MBTI_DIMENSIONS: MbtiDimension[] = [
  {
    key: 'energy',
    title: '에너지 방향',
    options: [
      { value: 'E', label: '외향 (E)', description: '사람들과 함께할 때 에너지를 얻어요' },
      { value: 'I', label: '내향 (I)', description: '혼자만의 시간에서 에너지를 얻어요' },
    ],
  },
  {
    key: 'perception',
    title: '인식 기능',
    options: [
      { value: 'S', label: '감각 (S)', description: '현실적이고 구체적인 것을 선호해요' },
      { value: 'N', label: '직관 (N)', description: '가능성과 아이디어를 중시해요' },
    ],
  },
  {
    key: 'judgment',
    title: '판단 기능',
    options: [
      { value: 'T', label: '사고 (T)', description: '논리와 객관적 분석을 중시해요' },
      { value: 'F', label: '감정 (F)', description: '가치와 조화를 중시해요' },
    ],
  },
  {
    key: 'lifestyle',
    title: '생활 양식',
    options: [
      { value: 'J', label: '판단 (J)', description: '계획적이고 체계적인 것을 선호해요' },
      { value: 'P', label: '인식 (P)', description: '유연하고 즉흥적인 것을 선호해요' },
    ],
  },
]

function MbtiPage() {
  const { goToNextStep, goToPreviousStep } = useOnboardingNavigation()
  const { data, updateMbti } = useOnboarding()

  // 기존 MBTI가 있으면 파싱
  const parseExistingMbti = (): MbtiSelections => {
    if (data.mbti && data.mbti.length === 4) {
      return {
        energy: data.mbti[0] as EnergyType,
        perception: data.mbti[1] as PerceptionType,
        judgment: data.mbti[2] as JudgmentType,
        lifestyle: data.mbti[3] as LifestyleType,
      }
    }
    return { energy: null, perception: null, judgment: null, lifestyle: null }
  }

  const [selections, setSelections] = useState<MbtiSelections>(parseExistingMbti())

  const handleSelect = (key: keyof MbtiSelections, value: string) => {
    setSelections((prev) => ({ ...prev, [key]: value }))
  }

  const isComplete = Object.values(selections).every((v) => v !== null)

  const getMbtiString = (): string => {
    return `${selections.energy}${selections.perception}${selections.judgment}${selections.lifestyle}`
  }

  const handleNext = () => {
    if (isComplete) {
      updateMbti(getMbtiString())
      goToNextStep()
    }
  }

  const handlePrevious = () => {
    if (isComplete) {
      updateMbti(getMbtiString())
    }
    goToPreviousStep()
  }

  return (
    <Screen>
      <Screen.Header behavior="overlay">
        <DetailHeaderBar onBackClick={handlePrevious} />
      </Screen.Header>

      <Screen.Content className="flex flex-1 flex-col overflow-y-auto bg-white">
        <TitleSection
          title={
            <>
              MBTI가
              <br />
              어떻게 되시나요?
            </>
          }
          description="성향에 맞는 상담을 제공해드릴게요"
        />

        <div className="mt-[32px] space-y-6 px-5">
          {MBTI_DIMENSIONS.map((dimension) => (
            <div key={dimension.key}>
              <p className="body2-semibold mb-3 text-gray-iron-700">{dimension.title}</p>
              <div className="flex gap-3">
                {dimension.options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSelect(dimension.key, option.value)}
                    className={cn(
                      'flex-1 rounded-[12px] border-2 p-4 text-center transition-all',
                      selections[dimension.key] === option.value
                        ? 'border-malmo-rasberry-500 bg-malmo-rasberry-50'
                        : 'border-gray-neutral-200 bg-white'
                    )}
                  >
                    <p className="body1-semibold text-gray-iron-950">{option.label}</p>
                    <p className="body4-medium mt-1 text-gray-iron-500">{option.description}</p>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* MBTI 미리보기 */}
        {isComplete && (
          <div className="mx-5 mt-6 rounded-[12px] bg-malmo-rasberry-50 p-4 text-center">
            <p className="body3-medium text-gray-iron-600">나의 MBTI</p>
            <p className="heading1-bold text-malmo-rasberry-500">{getMbtiString()}</p>
          </div>
        )}

        <div className="mt-auto mb-5 px-5 pb-[var(--safe-bottom)]">
          <Button text="다음" onClick={handleNext} disabled={!isComplete} />
        </div>
      </Screen.Content>
    </Screen>
  )
}
