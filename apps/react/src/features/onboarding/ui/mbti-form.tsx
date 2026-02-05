import { ReactNode, useState } from 'react'

import { TitleSection } from '@/features/onboarding/ui/title-section'
import { Screen } from '@/shared/layout/screen'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/shared/ui'
import { DetailHeaderBar } from '@/shared/ui/header-bar'

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
  options: { value: string; label: string }[]
}

const MBTI_DIMENSIONS: MbtiDimension[] = [
  {
    key: 'energy',
    title: '에너지를 회복하는 방식',
    options: [
      { value: 'E', label: '외향적 (E)' },
      { value: 'I', label: '내향적 (I)' },
    ],
  },
  {
    key: 'perception',
    title: '세상을 해석하는 방식',
    options: [
      { value: 'S', label: '현실적 (S)' },
      { value: 'N', label: '미래지향적 (N)' },
    ],
  },
  {
    key: 'judgment',
    title: '의사결정 기준',
    options: [
      { value: 'T', label: '논리적 (T)' },
      { value: 'F', label: '감정적 (F)' },
    ],
  },
  {
    key: 'lifestyle',
    title: '계획에 대한 태도',
    options: [
      { value: 'P', label: '즉흥적 (P)' },
      { value: 'J', label: '계획적 (J)' },
    ],
  },
]

interface MbtiFormProps {
  title: ReactNode
  description?: ReactNode
  headerTitle?: string
  initialValue?: string | null
  submitText: string
  isSubmitting?: boolean
  onSubmit: (mbti: string) => void
  onBack?: (mbti: string | null) => void
}

export function MbtiForm({
  title,
  description,
  headerTitle,
  initialValue = null,
  submitText,
  isSubmitting = false,
  onSubmit,
  onBack,
}: MbtiFormProps) {
  const parseExistingMbti = (): MbtiSelections => {
    if (initialValue && initialValue.length === 4) {
      return {
        energy: initialValue[0] as EnergyType,
        perception: initialValue[1] as PerceptionType,
        judgment: initialValue[2] as JudgmentType,
        lifestyle: initialValue[3] as LifestyleType,
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

  const handleSubmit = () => {
    if (!isComplete || isSubmitting) return
    onSubmit(getMbtiString())
  }

  const handleBack = () => {
    onBack?.(isComplete ? getMbtiString() : null)
  }

  return (
    <Screen>
      <Screen.Header behavior="overlay">
        <DetailHeaderBar title={headerTitle} onBackClick={onBack ? handleBack : undefined} />
      </Screen.Header>

      <Screen.Content className="flex flex-1 flex-col overflow-y-auto bg-white">
        <TitleSection title={title} description={description} />

        <div className="mt-[68px] space-y-4 px-5">
          {MBTI_DIMENSIONS.map((dimension) => (
            <div key={dimension.key}>
              <p className="body3-medium mb-2 text-gray-iron-950">{dimension.title}</p>
              <div className="flex gap-2">
                {dimension.options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSelect(dimension.key, option.value)}
                    className={cn(
                      'flex-1 rounded-[10px] border-1 py-4 text-center transition-all',
                      selections[dimension.key] === option.value
                        ? 'border-malmo-rasberry-500'
                        : 'border-gray-neutral-300'
                    )}
                  >
                    <p
                      className={cn(
                        'body2-medium',
                        selections[dimension.key] === option.value
                          ? 'text-malmo-rasberry-500'
                          : 'text-gray-iron-500'
                      )}
                    >
                      {option.label}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-auto mb-5 px-5 pb-[var(--safe-bottom)]">
          <Button text={submitText} onClick={handleSubmit} disabled={!isComplete || isSubmitting} />
        </div>
      </Screen.Content>
    </Screen>
  )
}
