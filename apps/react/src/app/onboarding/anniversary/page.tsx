import { createFileRoute } from '@tanstack/react-router'

import { AnniversaryLayout, useAnniversary, useUpdateStartDate } from '@/features/anniversary'
import { useOnboarding } from '@/features/onboarding/contexts/onboarding-context'
import { useOnboardingNavigation } from '@/features/onboarding/hooks/use-onboarding-navigation'
import { wrapWithTracking } from '@/shared/analytics'
import { BUTTON_NAMES, CATEGORIES } from '@/shared/analytics/constants'
import { formatDate } from '@/shared/utils/date'

export const Route = createFileRoute('/onboarding/anniversary/')({
  component: OnboardingAnniversary,
})

function OnboardingAnniversary() {
  const { goToNextStep } = useOnboardingNavigation()
  const { data, updateAnniversary } = useOnboarding()
  const anniversary = useAnniversary(data.anniversary)
  const updateStartDateMutation = useUpdateStartDate(async () => {
    goToNextStep()
  })

  const handleNext = wrapWithTracking(BUTTON_NAMES.NEXT_ANNIVERSARY, CATEGORIES.ONBOARDING, async () => {
    const finalDate = new Date(
      anniversary.state.visibleYear,
      anniversary.state.visibleMonth - 1,
      anniversary.state.visibleDay
    )
    updateAnniversary(finalDate)

    if (updateStartDateMutation.isPending) return
    const startLoveDate = formatDate(finalDate)

    try {
      await updateStartDateMutation.mutateAsync({ startLoveDate: startLoveDate ?? '' })
    } catch {
      return
    }
  })

  return (
    <AnniversaryLayout
      anniversary={anniversary}
      onSubmit={handleNext}
      isSubmitting={updateStartDateMutation.isPending}
      showBackButton={false}
    />
  )
}
