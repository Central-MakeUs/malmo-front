import { useMutation } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

import { PartnerCodeForm } from '@/features/couple'
import { useOnboarding } from '@/features/onboarding/contexts/onboarding-context'
import { useOnboardingNavigation } from '@/features/onboarding/hooks/use-onboarding-navigation'
import { wrapWithTracking } from '@/shared/analytics'
import { BUTTON_NAMES, CATEGORIES } from '@/shared/analytics/constants'
import coupleService from '@/shared/services/couple.service'
import { toast } from '@/shared/ui/toast'

export const Route = createFileRoute('/onboarding/partner-code/')({
  component: OnboardingPartnerCode,
})

function OnboardingPartnerCode() {
  const { goToNextStep, goToPreviousStep } = useOnboardingNavigation()
  const { data, updatePartnerCode, completeOnboarding } = useOnboarding()
  const [partnerCode, setPartnerCode] = useState(data.partnerCode || '')

  const connectCoupleMutation = useMutation({ ...coupleService.connectCoupleMutation() })

  const handlePrevious = wrapWithTracking(BUTTON_NAMES.BACK_PARTNER_CODE, CATEGORIES.ONBOARDING, () => {
    if (partnerCode.trim()) {
      updatePartnerCode(partnerCode)
    }
    goToPreviousStep()
  })

  const handleNext = wrapWithTracking(BUTTON_NAMES.CONNECT_PARTNER, CATEGORIES.ONBOARDING, async () => {
    if (!partnerCode.trim()) return

    updatePartnerCode(partnerCode)

    try {
      await connectCoupleMutation.mutateAsync(partnerCode)
    } catch {
      return
    }

    const success = await completeOnboarding()
    if (success) {
      toast.success('커플 연결이 완료되었어요!')
      goToNextStep()
    }
  })

  return (
    <PartnerCodeForm
      partnerCode={partnerCode}
      onPartnerCodeChange={setPartnerCode}
      onBack={handlePrevious}
      onSubmit={handleNext}
      isSubmitting={connectCoupleMutation.isPending}
    />
  )
}
