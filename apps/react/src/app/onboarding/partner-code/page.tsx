import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Button, HeaderNavigation, Input } from '@/shared/ui'
import { TitleSection } from '@/features/onboarding/ui/title-section'
import { useOnboardingNavigation } from '@/features/onboarding/hooks/use-onboarding-navigation'
import { useOnboarding } from '@/features/onboarding/contexts/onboarding-context'
import coupleService from '@/shared/services/couple.service'

export const Route = createFileRoute('/onboarding/partner-code/')({
  component: PartnerCodePage,
})

function PartnerCodePage() {
  const { goToNextStep, goToPreviousStep } = useOnboardingNavigation()
  const { data, updatePartnerCode, completeOnboarding } = useOnboarding()

  const [partnerCode, setPartnerCode] = useState(data.partnerCode || '')

  const connectCoupleMutation = useMutation({
    ...coupleService.connectCoupleMutation(),
  })

  const handlePrevious = () => {
    if (partnerCode.trim()) {
      updatePartnerCode(partnerCode)
    }
    goToPreviousStep()
  }

  const handleNext = async () => {
    if (!partnerCode.trim()) {
      alert('코드를 입력해주세요.')
      return
    }

    updatePartnerCode(partnerCode)

    try {
      // 커플 연결 API 호출
      await connectCoupleMutation.mutateAsync(partnerCode)

      // 회원가입 완료 처리
      const success = await completeOnboarding()
      if (success) {
        goToNextStep()
      } else {
        alert('회원가입 처리 중 오류가 발생했습니다. 다시 시도해주세요.')
      }
    } catch (error) {
      alert('유효하지 않은 커플 코드입니다.')
    }
  }

  return (
    <div className="flex h-screen w-full flex-col bg-white">
      {/* 헤더 및 타이틀 */}
      <HeaderNavigation onBack={handlePrevious} />
      <TitleSection
        title={
          <>
            상대방의 초대 코드를
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
        />
      </div>

      {/* 다음 버튼 */}
      <div className="mt-auto mb-10 px-5">
        <Button text="다음" onClick={handleNext} disabled={connectCoupleMutation.isPending} />
      </div>
    </div>
  )
}
