import { TitleSection } from '@/features/onboarding/ui/title-section'
import { useKeyboardSheetMotion } from '@/shared/hooks/use-keyboard-motion'
import { Screen } from '@/shared/layout/screen'
import { Input, Button } from '@/shared/ui'
import { DetailHeaderBar } from '@/shared/ui/header-bar'

interface PartnerCodeFormProps {
  partnerCode: string
  onPartnerCodeChange: (code: string) => void
  onBack: () => void
  onSubmit: () => void
  isSubmitting: boolean
}

export function PartnerCodeForm({
  partnerCode,
  onPartnerCodeChange,
  onBack,
  onSubmit,
  isSubmitting,
}: PartnerCodeFormProps) {
  const { keyboardBottom } = useKeyboardSheetMotion()

  return (
    <Screen>
      <Screen.Header behavior="overlay">
        <DetailHeaderBar onBackClick={onBack} />
      </Screen.Header>

      <Screen.Content className="flex flex-1 flex-col bg-white">
        <TitleSection
          title={
            <>
              연인의 커플 코드를
              <br />
              입력해 주세요
            </>
          }
        />

        <div className="mt-[68px] px-5">
          <Input
            type="text"
            value={partnerCode}
            onChange={(e) => onPartnerCodeChange(e.target.value)}
            placeholder="코드를 입력해 주세요"
            maxLength={7}
          />
        </div>

        <div className="mt-auto mb-5 px-5" style={keyboardBottom}>
          <Button text="연결하기" onClick={onSubmit} disabled={isSubmitting || !partnerCode.trim()} />
        </div>
      </Screen.Content>
    </Screen>
  )
}
