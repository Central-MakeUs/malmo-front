import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import loveLetter from '@/assets/images/love-letter.png'
import { TitleSection } from '@/features/onboarding/ui/title-section'
import { HeaderNavigation } from '@/shared/ui'
import { useOnboardingNavigation } from '@/features/onboarding/hooks/use-onboarding-navigation'
import { useOnboarding } from '@/features/onboarding/contexts/onboarding-context'
import memberService from '@/shared/services/member.service'
import ClipBoardIcon from '@/assets/icons/clip-board.svg'
import { toast } from '@/shared/components/toast'

export const Route = createFileRoute('/onboarding/my-code/')({
  component: MyCodePage,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(memberService.inviteCodeQuery())
  },
})

function MyCodePage() {
  const { goToNextStep, goToPreviousStep, goToHome } = useOnboardingNavigation()
  const { completeOnboarding } = useOnboarding()

  // 초대 코드 상태
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 초대 코드 가져오기
  const { data: inviteCodeData, isLoading: isLoadingInviteCode } = useQuery(memberService.inviteCodeQuery())
  const inviteCode = inviteCodeData?.data?.coupleCode || ''

  const handleCopyCode = () => {
    navigator.clipboard.writeText(inviteCode)
    toast.success('초대 코드 복사 완료! 연인에게 공유해 주세요')
  }

  const handleConnectWithCode = () => {
    // 코드 입력 페이지로 이동
    goToNextStep()
  }

  const handleSkip = async () => {
    setIsSubmitting(true)

    try {
      // 온보딩 종료 후 홈으로 이동
      const success = await completeOnboarding()

      if (success) {
        goToHome()
      }
    } catch (error) {
      // ToDo
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex h-screen w-full flex-col bg-white">
      {/* 헤더 및 타이틀 */}
      <HeaderNavigation onBack={goToPreviousStep} />
      <TitleSection
        title={
          <>
            커플 연결하고
            <br />
            말모를 시작해보세요
          </>
        }
      />

      {/* 러브레터 이미지 */}
      <div className="mt-[68px] flex flex-col items-center">
        <img src={loveLetter} alt="Love Letter" className="h-[100px] w-[100px]" />
      </div>

      {/* 초대 코드 */}
      <div className="mt-[24px] px-5">
        <div className="rounded-[10px] bg-gray-neutral-100">
          <div className="flex items-center justify-center px-[10px] py-[22px]">
            <div className="flex flex-col items-center">
              <p className="body3-medium text-gray-iron-500">나의 커플 초대 코드</p>
              <div className="mt-2 flex items-center">
                {isLoadingInviteCode ? (
                  <span className="heading1-semibold text-gray-iron-500">로딩 중...</span>
                ) : (
                  <span className="heading1-semibold text-gray-iron-950">{inviteCode}</span>
                )}
                <button onClick={handleCopyCode} className="ml-[10px]" disabled={isLoadingInviteCode}>
                  <ClipBoardIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 버튼 영역 */}
      <div className="mt-auto px-5 pb-[34px]">
        <button
          onClick={handleConnectWithCode}
          className="body1-semibold flex h-[56px] w-full items-center justify-center rounded-[10px] border border-malmo-rasberry-500 text-malmo-rasberry-500"
          disabled={isSubmitting}
        >
          상대방 코드로 연결하기
        </button>

        <div className="mt-[20px] flex justify-center">
          <button
            onClick={handleSkip}
            className="body3-medium text-gray-iron-400 underline decoration-1"
            disabled={isSubmitting}
          >
            일단 혼자 사용해볼게요
          </button>
        </div>
      </div>
    </div>
  )
}
