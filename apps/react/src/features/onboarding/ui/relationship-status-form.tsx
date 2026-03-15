import { ReactNode, useState } from 'react'

import { TitleSection } from '@/features/onboarding/ui/title-section'
import { Screen } from '@/shared/layout/screen'
import { Button } from '@/shared/ui'
import { DetailHeaderBar } from '@/shared/ui/header-bar'
import { SelectableButton } from '@/shared/ui/selectable-button'

interface RelationshipStatusOption {
  value: string
  label: string
}

interface RelationshipStatusFormProps {
  title: ReactNode
  description?: ReactNode
  headerTitle?: string
  options: RelationshipStatusOption[]
  initialValue?: string | null
  submitText: string
  requireChangeForSubmit?: boolean
  isSubmitting?: boolean
  showBackButton?: boolean
  onSubmit: (value: string) => void
  onBack?: (value: string | null) => void
}

export function RelationshipStatusForm({
  title,
  description,
  headerTitle,
  options,
  initialValue = null,
  submitText,
  requireChangeForSubmit = false,
  isSubmitting = false,
  showBackButton = true,
  onSubmit,
  onBack,
}: RelationshipStatusFormProps) {
  const [selected, setSelected] = useState<string | null>(initialValue)
  const isChanged = !!selected && selected !== initialValue
  const canSubmit = !!selected && !isSubmitting && (!requireChangeForSubmit || isChanged)

  const handleSubmit = () => {
    if (!selected || !canSubmit) return
    onSubmit(selected)
  }

  const handleBack = () => {
    onBack?.(selected)
  }

  return (
    <Screen>
      <Screen.Header behavior="overlay">
        <DetailHeaderBar
          title={headerTitle}
          showBackButton={showBackButton}
          onBackClick={onBack ? handleBack : undefined}
        />
      </Screen.Header>

      <Screen.Content className="flex flex-1 flex-col bg-white">
        <TitleSection title={title} description={description} />

        <div className="mt-[68px] space-y-2 px-5">
          {options.map((option) => (
            <SelectableButton
              key={option.value}
              selected={selected === option.value}
              onClick={() => setSelected(option.value)}
              className="w-full text-left"
            >
              {option.label}
            </SelectableButton>
          ))}
        </div>

        <div className="mt-auto mb-5 px-5 pb-[var(--safe-bottom)]">
          <Button text={submitText} onClick={handleSubmit} disabled={!canSubmit} />
        </div>
      </Screen.Content>
    </Screen>
  )
}
