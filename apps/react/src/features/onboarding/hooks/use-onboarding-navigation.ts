import { useNavigate } from '@tanstack/react-router'

// 온보딩 단계 정의
const ONBOARDING_STEPS = [
  '/onboarding/terms',
  '/onboarding/nickname',
  '/onboarding/anniversary',
  '/onboarding/my-code',
  '/onboarding/partner-code',
  '/onboarding/complete',
] as const

type OnboardingStep = (typeof ONBOARDING_STEPS)[number]

export function useOnboardingNavigation() {
  const navigate = useNavigate()

  // 현재 경로에 따른 단계 인덱스 찾기
  const getCurrentStepIndex = (): number => {
    const currentPath = window.location.pathname
    return ONBOARDING_STEPS.findIndex((step) => currentPath.endsWith(step))
  }

  // 다음 단계로 이동
  const goToNextStep = () => {
    const currentIndex = getCurrentStepIndex()

    if (currentIndex >= 0 && currentIndex < ONBOARDING_STEPS.length - 1) {
      const nextStep = ONBOARDING_STEPS[currentIndex + 1] as OnboardingStep
      navigate({ to: nextStep })
      return true
    }
    return false
  }

  // 이전 단계로 이동
  const goToPreviousStep = () => {
    const currentIndex = getCurrentStepIndex()

    if (currentIndex > 0) {
      const prevStep = ONBOARDING_STEPS[currentIndex - 1] as OnboardingStep
      navigate({ to: prevStep })
      return true
    }
    return false
  }

  // 홈으로 이동
  const goToHome = () => {
    navigate({ to: '/', replace: true })
  }

  return {
    goToNextStep,
    goToPreviousStep,
    goToHome,
    currentStepIndex: getCurrentStepIndex(),
    totalSteps: ONBOARDING_STEPS.length,
    ONBOARDING_STEPS,
  }
}
