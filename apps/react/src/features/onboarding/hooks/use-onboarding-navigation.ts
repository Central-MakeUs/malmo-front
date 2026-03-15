import { useNavigate, useRouterState } from '@tanstack/react-router'

import { useAuth } from '@/features/auth'
import { useOnboarding, type RelationshipStatus } from '@/features/onboarding/contexts/onboarding-context'

// 온보딩 단계 (이용약관 → 닉네임 → 연애상태 → 홈)
const STEPS = ['/onboarding/terms', '/onboarding/nickname', '/onboarding/relationship-status'] as const

type OnboardingStep = (typeof STEPS)[number]

export function useOnboardingNavigation() {
  const navigate = useNavigate()
  const { location } = useRouterState()
  const { refreshUserInfo } = useAuth()
  const { data, completeOnboarding } = useOnboarding()

  const ONBOARDING_STEPS = [...STEPS]

  // 현재 경로에 따른 단계 인덱스 찾기
  const getCurrentStepIndex = (): number => {
    // trailing slash 제거 후 비교
    const currentPath = location.pathname.replace(/\/$/, '')
    return ONBOARDING_STEPS.findIndex((step) => currentPath === step)
  }

  // 특정 단계로 이동
  const goToStep = (step: OnboardingStep) => {
    navigate({ to: step, replace: true })
  }

  // 다음 단계로 이동
  const goToNextStep = () => {
    const currentIndex = getCurrentStepIndex()

    if (currentIndex >= 0 && currentIndex < ONBOARDING_STEPS.length - 1) {
      const nextStep = ONBOARDING_STEPS[currentIndex + 1] as OnboardingStep
      navigate({ to: nextStep, replace: true })
      return true
    }
    return false
  }

  // 이전 단계로 이동
  const goToPreviousStep = () => {
    const currentIndex = getCurrentStepIndex()

    if (currentIndex > 0) {
      const prevStep = ONBOARDING_STEPS[currentIndex - 1] as OnboardingStep
      navigate({ to: prevStep, replace: true })
      return true
    }
    return false
  }

  // 홈으로 이동
  const goToHome = async () => {
    await refreshUserInfo()
    navigate({ to: '/', replace: true })
  }

  // 온보딩 완료 후 홈으로 이동 (마지막 단계에서 호출, state 업데이트 전 값을 override로 전달)
  const completeAndGoHome = async (relationshipStatus: RelationshipStatus) => {
    const success = await completeOnboarding({ relationshipStatus })
    if (success) await goToHome()
  }

  return {
    goToNextStep,
    goToPreviousStep,
    goToStep,
    goToHome,
    completeAndGoHome,
    currentStepIndex: getCurrentStepIndex(),
    totalSteps: ONBOARDING_STEPS.length,
    ONBOARDING_STEPS,
    isCouple: data.relationshipStatus === 'IN_RELATIONSHIP',
  }
}
