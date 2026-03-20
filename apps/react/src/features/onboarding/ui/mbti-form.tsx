import { ReactNode, useState } from 'react'

import { TitleSection } from '@/features/onboarding/ui/title-section'
import { Screen } from '@/shared/layout/screen'
import { Button } from '@/shared/ui'
import { DetailHeaderBar } from '@/shared/ui/header-bar'
import { SelectableButton } from '@/shared/ui/selectable-button'

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
  navCenter?: ReactNode
  contentTopSlot?: ReactNode
  initialValue?: string | null
  submitText: string
  requireChangeForSubmit?: boolean
  isSubmitting?: boolean
  onSubmit: (mbti: string) => void
  onBack?: (mbti: string | null) => void
}

export function MbtiForm({
  title,
  description,
  headerTitle,
  navCenter,
  contentTopSlot,
  initialValue = null,
  submitText,
  requireChangeForSubmit = false,
  isSubmitting = false,
  onSubmit,
  onBack,
}: MbtiFormProps) {
  const emptySelections: MbtiSelections = {
    energy: null,
    perception: null,
    judgment: null,
    lifestyle: null,
  }

  const parseExistingMbti = (): MbtiSelections => {
    if (!initialValue) return emptySelections

    const normalized = initialValue.trim().toUpperCase()
    if (!/^[EI][SN][TF][JP]$/.test(normalized)) {
      return emptySelections
    }

    return {
      energy: normalized[0] as EnergyType,
      perception: normalized[1] as PerceptionType,
      judgment: normalized[2] as JudgmentType,
      lifestyle: normalized[3] as LifestyleType,
    }
  }

  const initialSelections = parseExistingMbti()
  const [selections, setSelections] = useState<MbtiSelections>(initialSelections)

  const handleSelect = (key: keyof MbtiSelections, value: string) => {
    setSelections((prev) => ({ ...prev, [key]: value }))
  }

  const toMbtiString = (value: MbtiSelections): string | null => {
    if (Object.values(value).some((v) => v === null)) return null
    return `${value.energy}${value.perception}${value.judgment}${value.lifestyle}`
  }
  const currentMbti = toMbtiString(selections)
  const initialMbti = toMbtiString(initialSelections)
  const isChanged = !!currentMbti && currentMbti !== initialMbti
  const canSubmit = !!currentMbti && !isSubmitting && (!requireChangeForSubmit || isChanged)

  const handleSubmit = () => {
    if (!currentMbti || !canSubmit) return
    onSubmit(currentMbti)
  }

  const handleBack = () => {
    onBack?.(currentMbti)
  }

  return (
    <Screen>
      <Screen.Header behavior="overlay">
        <DetailHeaderBar title={headerTitle} center={navCenter} onBackClick={onBack ? handleBack : undefined} />
      </Screen.Header>

      <Screen.Content className="flex flex-1 flex-col overflow-y-auto bg-white">
        {contentTopSlot}
        <TitleSection title={title} description={description} />

        <div className="mt-[68px] space-y-4 px-5">
          {MBTI_DIMENSIONS.map((dimension) => (
            <div key={dimension.key}>
              <p className="body3-medium mb-2 text-gray-iron-950">{dimension.title}</p>
              <div className="flex gap-2">
                {dimension.options.map((option) => (
                  <SelectableButton
                    key={option.value}
                    selected={selections[dimension.key] === option.value}
                    onClick={() => handleSelect(dimension.key, option.value)}
                    className="flex-1 py-3"
                  >
                    {option.label}
                  </SelectableButton>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-auto mb-5 px-5 pb-[var(--safe-bottom)]">
          <Button text={submitText} onClick={handleSubmit} disabled={!canSubmit} />
        </div>
      </Screen.Content>
    </Screen>
  )
}
