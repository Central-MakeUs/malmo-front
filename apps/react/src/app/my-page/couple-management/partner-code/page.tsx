import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'

import { useAuth } from '@/features/auth'
import { PartnerCodeForm } from '@/features/couple'
import { usePartnerInfo } from '@/features/member'
import { wrapWithTracking, BUTTON_NAMES, CATEGORIES } from '@/shared/analytics'
import coupleService from '@/shared/services/couple.service'
import { queryKeys } from '@/shared/services/query-keys'
import { toast } from '@/shared/ui/toast'

export const Route = createFileRoute('/my-page/couple-management/partner-code/')({
  component: CoupleManagementPartnerCode,
})

function CoupleManagementPartnerCode() {
  const [partnerCode, setPartnerCode] = useState('')
  const connectCoupleMutation = useMutation({ ...coupleService.connectCoupleMutation() })
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { refreshUserInfo } = useAuth()
  const { data: partnerInfo, refetch: refetchPartnerInfo } = usePartnerInfo()

  const handlePrevious = wrapWithTracking(BUTTON_NAMES.BACK_PARTNER_CODE, CATEGORIES.ONBOARDING, () => {
    navigate({ to: '/my-page/couple-management', replace: true })
  })

  const handleNext = wrapWithTracking(BUTTON_NAMES.CONNECT_PARTNER, CATEGORIES.ONBOARDING, async () => {
    if (!partnerCode.trim()) return

    try {
      await connectCoupleMutation.mutateAsync(partnerCode)
    } catch {
      return
    }

    toast.success('커플 연결이 완료되었어요!')

    await refreshUserInfo()
    queryClient.removeQueries({ queryKey: queryKeys.member.partnerInfo() })
    const { data: updatedPartnerInfo } = await refetchPartnerInfo()
    const hasAnniversary = updatedPartnerInfo?.isStartLoveDateUpdated ?? partnerInfo?.isStartLoveDateUpdated ?? false

    if (hasAnniversary) {
      navigate({ to: '/my-page/couple-management', replace: true })
      return
    }

    navigate({ to: '/my-page/couple-management/anniversary', replace: true })
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
