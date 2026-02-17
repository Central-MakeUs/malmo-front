import { ReactNode, useState } from 'react'

import { TitleSection } from '@/features/onboarding/ui/title-section'
import { Screen } from '@/shared/layout/screen'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/shared/ui'
import { DetailHeaderBar } from '@/shared/ui/header-bar'

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
        <DetailHeaderBar title={headerTitle} onBackClick={onBack ? handleBack : undefined} />
      </Screen.Header>

      <Screen.Content className="flex flex-1 flex-col bg-white">
        <TitleSection title={title} description={description} />

        <div className="mt-[68px] space-y-2 px-5">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => setSelected(option.value)}
              className={cn(
                'flex w-full items-center rounded-[10px] border px-5 py-4 text-left transition-all',
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
          <Button text={submitText} onClick={handleSubmit} disabled={!canSubmit} />
        </div>
      </Screen.Content>
    </Screen>
  )
}
