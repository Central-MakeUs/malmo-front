import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/shared/ui'
import { useOnboardingNavigation } from '@/features/onboarding/hooks/use-onboarding-navigation'
import onboardingEndImage from '@/assets/images/onboarding-end.png'

export const Route = createFileRoute('/onboarding/complete/')({
  component: ConnectCompletePage,
})

function ConnectCompletePage() {
  const { goToHome } = useOnboardingNavigation()

  const handleNext = () => {
    // 홈으로 이동
    goToHome()
  }

  return (
    <div className="flex h-screen w-full flex-col bg-white">
      {/* 상단 여백 */}
      <div className="mt-[148px] flex flex-col items-center">
        {/* 이미지 */}
        <img src={onboardingEndImage} alt="온보딩 완료" className="h-[236px] w-[320px] object-contain" />

        {/* 텍스트 영역 */}
        <div className="mt-[24px] flex flex-col items-center">
          <h1 className="title2-bold text-gray-iron-950">커플 연결이 완료되었어요!</h1>
          <p className="body2-medium mt-[4px] text-gray-iron-400">이제 말모를 사용하러 가볼까요?</p>
        </div>
      </div>

      {/* 다음 버튼 */}
      <div className="mt-auto mb-10 px-5">
        <Button text="시작하기" onClick={handleNext} />
      </div>
    </div>
  )
}
