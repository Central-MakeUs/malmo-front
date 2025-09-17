import { useMutation } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

import { useOnboarding } from '@/features/onboarding/contexts/onboarding-context'
import { useOnboardingNavigation } from '@/features/onboarding/hooks/use-onboarding-navigation'
import { TitleSection } from '@/features/onboarding/ui/title-section'
import { wrapWithTracking } from '@/shared/analytics'
import { BUTTON_NAMES, CATEGORIES } from '@/shared/analytics/constants'
import { useKeyboardSheetMotion } from '@/shared/hooks/use-keyboard-motion'
import coupleService from '@/shared/services/couple.service'
import { Button, Input } from '@/shared/ui'
import { DetailHeaderBar } from '@/shared/ui/header-bar'

export const Route = createFileRoute('/onboarding/partner-code/')({
  component: PartnerCodePage,
})

function PartnerCodePage() {
  const { goToNextStep, goToPreviousStep } = useOnboardingNavigation()
  const { data, updatePartnerCode, completeOnboarding } = useOnboarding()
  const { keyboardBottom } = useKeyboardSheetMotion()

  const [partnerCode, setPartnerCode] = useState(data.partnerCode || '')

  const connectCoupleMutation = useMutation({
    ...coupleService.connectCoupleMutation(),
  })

  const handlePrevious = wrapWithTracking(BUTTON_NAMES.BACK_PARTNER_CODE, CATEGORIES.ONBOARDING, () => {
    if (partnerCode.trim()) {
      updatePartnerCode(partnerCode)
    }
    goToPreviousStep()
  })

  const handleNext = wrapWithTracking(BUTTON_NAMES.CONNECT_PARTNER, CATEGORIES.ONBOARDING, async () => {
    if (!partnerCode.trim()) {
      alert('코드를 입력해주세요.')
      return
    }

    updatePartnerCode(partnerCode)

    // 커플 연결 API 호출
    await connectCoupleMutation.mutateAsync(partnerCode)

    // 회원가입 완료 처리
    const success = await completeOnboarding()
    if (success) goToNextStep()
  })

  return (
    <div className="flex h-full w-full flex-col bg-white">
      {/* 헤더 및 타이틀 */}
      <DetailHeaderBar onBackClick={handlePrevious} />
      <TitleSection
        title={
          <>
            연인의 커플 코드를
            <br />
            입력해주세요
          </>
        }
      />

      {/* 코드 입력 */}
      <div className="mt-[68px] px-5">
        <Input
          type="text"
          value={partnerCode}
          onChange={(e) => setPartnerCode(e.target.value)}
          placeholder="코드를 입력해주세요"
          maxLength={7}
        />
      </div>

      {/* 다음 버튼 */}
      <div className="mt-auto mb-5 px-5" style={keyboardBottom}>
        <Button
          text="연결하기"
          onClick={handleNext}
          disabled={connectCoupleMutation.isPending || !partnerCode.trim()}
        />
      </div>
    </div>
  )
}
