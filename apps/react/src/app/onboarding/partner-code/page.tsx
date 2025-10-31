import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { z } from 'zod'

import { useAuth } from '@/features/auth'
import { useOnboarding } from '@/features/onboarding/contexts/onboarding-context'
import { useOnboardingNavigation } from '@/features/onboarding/hooks/use-onboarding-navigation'
import { TitleSection } from '@/features/onboarding/ui/title-section'
import { wrapWithTracking } from '@/shared/analytics'
import { BUTTON_NAMES, CATEGORIES } from '@/shared/analytics/constants'
import { useKeyboardSheetMotion } from '@/shared/hooks/use-keyboard-motion'
import { Screen } from '@/shared/layout/screen'
import coupleService from '@/shared/services/couple.service'
import memberService from '@/shared/services/member.service'
import { queryKeys } from '@/shared/services/query-keys'
import { Button, Input } from '@/shared/ui'
import { DetailHeaderBar } from '@/shared/ui/header-bar'
import { toast } from '@/shared/ui/toast'

const searchSchema = z.object({
  coupleFlow: z.boolean().optional(),
})

export const Route = createFileRoute('/onboarding/partner-code/')({
  component: PartnerCodePage,
  validateSearch: searchSchema,
})

function PartnerCodePage() {
  const { goToNextStep, goToPreviousStep } = useOnboardingNavigation()
  const { data, updatePartnerCode, completeOnboarding } = useOnboarding()
  const { keyboardBottom } = useKeyboardSheetMotion()

  const [partnerCode, setPartnerCode] = useState(data.partnerCode || '')

  const connectCoupleMutation = useMutation({ ...coupleService.connectCoupleMutation() })

  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { refreshUserInfo } = useAuth()
  const { coupleFlow } = Route.useSearch()
  const isCoupleFlow = coupleFlow === true

  const handlePrevious = wrapWithTracking(BUTTON_NAMES.BACK_PARTNER_CODE, CATEGORIES.ONBOARDING, () => {
    if (isCoupleFlow) {
      navigate({ to: '/my-page/couple-management', replace: true })
      return
    }
    if (partnerCode.trim()) {
      updatePartnerCode(partnerCode)
    }
    goToPreviousStep()
  })

  const handleNext = wrapWithTracking(BUTTON_NAMES.CONNECT_PARTNER, CATEGORIES.ONBOARDING, async () => {
    if (!partnerCode.trim()) {
      alert('코드를 입력해 주세요.')
      return
    }

    updatePartnerCode(partnerCode)

    try {
      await connectCoupleMutation.mutateAsync(partnerCode)
    } catch {
      return
    }

    if (isCoupleFlow) {
      toast.success('커플 연결이 완료되었어요!')
      await refreshUserInfo()
      queryClient.setQueryData(queryKeys.member.partnerInfo(), null)
      await queryClient.invalidateQueries({ queryKey: queryKeys.member.partnerInfo() })
      const updatedPartnerInfo = await queryClient.ensureQueryData(memberService.partnerInfoQuery())
      const alreadySetAnniversary = updatedPartnerInfo?.data?.isStartLoveDateUpdated

      if (alreadySetAnniversary) {
        navigate({ to: '/my-page/couple-management', replace: true })
      } else {
        navigate({ to: '/onboarding/anniversary', search: { coupleFlow: true }, replace: true })
      }

      return
    }

    const success = await completeOnboarding()
    if (success) {
      toast.success('커플 연결이 완료되었어요!')
      goToNextStep()
    }
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
            onChange={(e) => setPartnerCode(e.target.value)}
            placeholder="코드를 입력해 주세요"
            maxLength={7}
          />
        </div>

        <div className="mt-auto mb-5 px-5" style={keyboardBottom}>
          <Button
            text="연결하기"
            onClick={handleNext}
            disabled={connectCoupleMutation.isPending || !partnerCode.trim()}
          />
        </div>
      </Screen.Content>
    </Screen>
  )
}
