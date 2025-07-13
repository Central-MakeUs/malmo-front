import { createFileRoute, Outlet } from '@tanstack/react-router'
import { OnboardingProvider } from '@/features/onboarding/contexts/onboarding-context'

export const Route = createFileRoute('/onboarding')({
  component: OnboardingLayout,
})

function OnboardingLayout() {
  return (
    <OnboardingProvider>
      <Outlet />
    </OnboardingProvider>
  )
}
