import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Button, HeaderNavigation, Input } from '@/shared/ui'
import { TitleSection } from '@/features/onboarding/ui/title-section'
import { useOnboardingNavigation } from '@/features/onboarding/hooks/use-onboarding-navigation'
import { useOnboarding } from '@/features/onboarding/contexts/onboarding-context'

// 닉네임 최대 길이 상수
const MAX_LENGTH = 10

export const Route = createFileRoute('/onboarding/nickname/')({
  component: NicknamePage,
})

function NicknamePage() {
  const { goToNextStep, goToPreviousStep } = useOnboardingNavigation()
  const { data, updateNickname } = useOnboarding()

  const [nickname, setNickname] = useState(data.nickname || '')

  const handleNext = () => {
    if (nickname.trim()) {
      // 온보딩 컨텍스트 업데이트
      updateNickname(nickname)
      goToNextStep()
    }
  }

  const handlePrevious = () => {
    // 온보딩 컨텍스트 업데이트
    updateNickname(nickname)
    goToPreviousStep()
  }

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 특수문자와 공백 제거
    const filteredValue = e.target.value.replace(/[^\w가-힣ㄱ-ㅎㅏ-ㅣ]/g, '')

    // 최대 길이 제한
    if (filteredValue.length <= MAX_LENGTH) {
      setNickname(filteredValue)
    }
  }

  return (
    <div className="flex h-screen w-full flex-col bg-white">
      {/* 헤더 및 타이틀 */}
      <HeaderNavigation onBack={handlePrevious} />
      <TitleSection
        title={
          <>
            만나서 반가워요
            <br />
            어떻게 불러드릴까요?
          </>
        }
      />

      {/* 닉네임 입력 */}
      <div className="mt-[68px] px-5">
        <div className="flex flex-col">
          <div className="relative">
            <Input
              type="text"
              value={nickname}
              onChange={handleNicknameChange}
              placeholder="닉네임을 입력해주세요"
              className="body2-medium"
            />
            <div className="absolute top-1/2 right-5 -translate-y-1/2 text-[15px] font-medium text-gray-iron-500">
              {nickname.length}/{MAX_LENGTH}
            </div>
          </div>
          <p className="label1-regular mt-2 text-gray-iron-950">특수문자, 띄어쓰기 없이 작성해주세요.</p>
        </div>
      </div>

      {/* 다음 버튼 */}
      <div className="mt-auto mb-10 px-5">
        <Button text="다음" onClick={handleNext} />
      </div>
    </div>
  )
}
