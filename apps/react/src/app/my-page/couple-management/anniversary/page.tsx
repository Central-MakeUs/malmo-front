import { createFileRoute, useNavigate } from '@tanstack/react-router'

import { AnniversaryLayout, useAnniversary, useUpdateStartDate } from '@/features/anniversary'
import { wrapWithTracking, BUTTON_NAMES, CATEGORIES } from '@/shared/analytics'

export const Route = createFileRoute('/my-page/couple-management/anniversary/')({
  component: CoupleManagementAnniversary,
})

function CoupleManagementAnniversary() {
  const navigate = useNavigate()
  const anniversary = useAnniversary(null)
  const updateStartDateMutation = useUpdateStartDate(async () => {
    navigate({ to: '/my-page/couple-management', replace: true })
  })

  const handleNext = wrapWithTracking(BUTTON_NAMES.NEXT_ANNIVERSARY, CATEGORIES.ONBOARDING, async () => {
    if (updateStartDateMutation.isPending) return

    const finalDate = new Date(
      anniversary.state.visibleYear,
      anniversary.state.visibleMonth - 1,
      anniversary.state.visibleDay
    )
    const startLoveDate = finalDate.toISOString().split('T')[0]

    try {
      await updateStartDateMutation.mutateAsync({ startLoveDate: startLoveDate ?? '' })
    } catch {
      return
    }
  })

  const handleBack = wrapWithTracking(BUTTON_NAMES.BACK_ANNIVERSARY, CATEGORIES.ONBOARDING, () => {
    navigate({ to: '/my-page/couple-management', replace: true })
  })

  return (
    <AnniversaryLayout
      anniversary={anniversary}
      onSubmit={handleNext}
      isSubmitting={updateStartDateMutation.isPending}
      showBackButton={true}
      onBack={handleBack}
    />
  )
}
