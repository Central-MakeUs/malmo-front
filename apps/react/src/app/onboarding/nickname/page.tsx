import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/shared/ui'
import { TitleSection } from '@/features/onboarding/ui/title-section'
import { useOnboardingNavigation } from '@/features/onboarding/hooks/use-onboarding-navigation'
import { useOnboarding } from '@/features/onboarding/contexts/onboarding-context'
import { useNicknameInput, NicknameInput } from '@/features/profile'
import { DetailHeaderBar } from '@/shared/components/header-bar'

export const Route = createFileRoute('/onboarding/nickname/')({
  component: NicknamePage,
})

function NicknamePage() {
  const { goToNextStep, goToPreviousStep } = useOnboardingNavigation()
  const { data, updateNickname } = useOnboarding()

  const { nickname, handleNicknameChange, isValid, maxLength } = useNicknameInput({
    initialValue: data.nickname || '',
    onNicknameChange: updateNickname,
  })

  const handleNext = () => {
    if (isValid) {
      updateNickname(nickname)
      goToNextStep()
    }
  }

  const handlePrevious = () => {
    updateNickname(nickname)
    goToPreviousStep()
  }

  return (
    <div className="flex h-screen w-full flex-col bg-white">
      {/* 헤더 및 타이틀 */}
      <DetailHeaderBar onBackClick={handlePrevious} />
      <TitleSection
        title={
          <>
            만나서 반가워요!
            <br />
            어떻게 불러드릴까요?
          </>
        }
      />

      {/* 닉네임 입력 */}
      <div className="mt-[68px] px-5">
        <NicknameInput
          value={nickname}
          onChange={handleNicknameChange}
          maxLength={maxLength}
          placeholder="닉네임을 입력해주세요"
          className="body2-medium"
        />
      </div>

      {/* 다음 버튼 */}
      <div className="mt-auto mb-10 px-5">
        <Button text="다음" onClick={handleNext} disabled={!isValid} />
      </div>
    </div>
  )
}
