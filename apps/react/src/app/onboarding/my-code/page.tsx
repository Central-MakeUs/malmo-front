import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

import ClipBoardIcon from '@/assets/icons/clip-board.svg'
import loveLetter from '@/assets/images/love-letter.png'
import { useOnboarding } from '@/features/onboarding/contexts/onboarding-context'
import { useOnboardingNavigation } from '@/features/onboarding/hooks/use-onboarding-navigation'
import { TitleSection } from '@/features/onboarding/ui/title-section'
import { wrapWithTracking } from '@/shared/analytics'
import { BUTTON_NAMES, CATEGORIES } from '@/shared/analytics/constants'
import { Screen } from '@/shared/layout/screen'
import memberService from '@/shared/services/member.service'
import { DetailHeaderBar } from '@/shared/ui/header-bar'
import { toast } from '@/shared/ui/toast'

export const Route = createFileRoute('/onboarding/my-code/')({
  component: MyCodePage,
})

function MyCodePage() {
  const { goToNextStep, goToPreviousStep, goToHome } = useOnboardingNavigation()
  const { completeOnboarding } = useOnboarding()

  const [isSubmitting, setIsSubmitting] = useState(false)

  const { data: inviteCodeData, isLoading: isLoadingInviteCode } = useQuery(memberService.inviteCodeQuery())
  const inviteCode = inviteCodeData?.data?.coupleCode || ''

  const handleCopyCode = wrapWithTracking(BUTTON_NAMES.COPY_MY_CODE, CATEGORIES.ONBOARDING, () => {
    navigator.clipboard.writeText(inviteCode)
    toast.success('초대 코드 복사 완료! 연인에게 공유해 주세요')
  })

  const handleConnectWithCode = wrapWithTracking(BUTTON_NAMES.GO_PARTNER_CODE, CATEGORIES.ONBOARDING, () => {
    goToNextStep()
  })

  const handleSkip = wrapWithTracking(BUTTON_NAMES.SKIP_PARTNER, CATEGORIES.ONBOARDING, async () => {
    setIsSubmitting(true)

    try {
      const success = await completeOnboarding()

      if (success) {
        goToHome()
      }
    } catch {
      // noop: 에러 토스트는 하위 훅에서 처리
    } finally {
      setIsSubmitting(false)
    }
  })

  return (
    <Screen>
      <Screen.Header behavior="overlay">
        <DetailHeaderBar
          onBackClick={wrapWithTracking(BUTTON_NAMES.BACK_MY_CODE, CATEGORIES.ONBOARDING, () => goToPreviousStep())}
        />
      </Screen.Header>

      <Screen.Content className="flex flex-1 flex-col bg-white">
        <TitleSection
          title={
            <>
              커플 연동으로
              <br />더 정확한 상담을 받아 보세요
            </>
          }
          description="연인에게 커플 코드를 보내 커플 연동을 해주세요!"
        />

        <div className="mt-[68px] flex flex-col items-center">
          <img src={loveLetter} alt="Love Letter" className="h-[100px] w-[100px]" />
        </div>

        <div className="mt-[24px] px-5">
          <div className="rounded-[10px] bg-gray-neutral-100">
            <div className="flex items-center justify-center px-[10px] py-[22px]">
              <div className="flex flex-col items-center">
                <p className="body3-medium text-gray-iron-950">나의 커플 코드</p>
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

        <div className="mt-auto mb-5 space-y-2 px-5 pb-[var(--safe-bottom)]">
          <button
            onClick={handleConnectWithCode}
            className="body1-semibold flex h-[56px] w-full items-center justify-center rounded-[10px] bg-malmo-rasberry-500 text-white"
            disabled={isSubmitting}
          >
            연인 코드로 연결하기
          </button>

          <button
            onClick={handleSkip}
            className="body1-semibold flex h-[56px] w-full items-center justify-center rounded-[10px] border border-malmo-rasberry-500 text-malmo-rasberry-500"
            disabled={isSubmitting}
          >
            혼자 사용하기
          </button>
        </div>
      </Screen.Content>
    </Screen>
  )
}
