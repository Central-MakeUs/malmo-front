import { createFileRoute } from '@tanstack/react-router'

import { useOnboarding } from '@/features/onboarding/contexts/onboarding-context'
import { useOnboardingNavigation } from '@/features/onboarding/hooks/use-onboarding-navigation'
import { TitleSection } from '@/features/onboarding/ui/title-section'
import { useNicknameInput, NicknameInput } from '@/features/profile'
import { wrapWithTracking } from '@/shared/analytics'
import { BUTTON_NAMES, CATEGORIES } from '@/shared/analytics/constants'
import { useKeyboardSheetMotion } from '@/shared/hooks/use-keyboard-motion'
import { Screen } from '@/shared/layout/screen'
import { Button } from '@/shared/ui'
import { DetailHeaderBar } from '@/shared/ui/header-bar'

export const Route = createFileRoute('/onboarding/nickname/')({
  component: NicknamePage,
})

function NicknamePage() {
  const { goToNextStep, goToPreviousStep } = useOnboardingNavigation()
  const { data, updateNickname } = useOnboarding()
  const { keyboardBottom } = useKeyboardSheetMotion()

  const { nickname, handleNicknameChange, isValid, maxLength } = useNicknameInput({
    initialValue: data.nickname || '',
    onNicknameChange: updateNickname,
  })

  const handleNext = wrapWithTracking(BUTTON_NAMES.NEXT_NICKNAME, CATEGORIES.ONBOARDING, () => {
    if (isValid) {
      updateNickname(nickname)
      goToNextStep()
    }
  })

  const handlePrevious = wrapWithTracking(BUTTON_NAMES.BACK_NICKNAME, CATEGORIES.ONBOARDING, () => {
    updateNickname(nickname)
    goToPreviousStep()
  })

  return (
    <Screen>
      <Screen.Header behavior="overlay">
        <DetailHeaderBar onBackClick={handlePrevious} />
      </Screen.Header>

      <Screen.Content className="flex flex-1 flex-col bg-white">
        <TitleSection
          title={
            <>
              만나서 반가워요!
              <br />
              어떻게 불러드릴까요?
            </>
          }
        />

        <div className="mt-[68px] px-5">
          <NicknameInput
            value={nickname}
            onChange={handleNicknameChange}
            maxLength={maxLength}
            placeholder="닉네임을 입력해 주세요"
            className="body2-medium"
          />
        </div>

        <div className="mt-auto mb-5 px-5" style={keyboardBottom}>
          <Button text="다음" onClick={handleNext} disabled={!isValid} />
        </div>
      </Screen.Content>
    </Screen>
  )
}
