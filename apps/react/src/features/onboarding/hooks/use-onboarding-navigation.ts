import { useNavigate, useRouterState } from '@tanstack/react-router'

import { useAuth } from '@/features/auth'
import { useOnboarding } from '@/features/onboarding/contexts/onboarding-context'

// 기본 온보딩 단계 (모든 사용자 공통)
const BASE_STEPS = [
  '/onboarding/terms',
  '/onboarding/nickname',
  '/onboarding/relationship-status',
  '/onboarding/mbti',
  '/onboarding/partner-mbti',
] as const

// 커플 전용 단계
const COUPLE_STEPS = [
  '/onboarding/my-code',
  '/onboarding/partner-code',
  '/onboarding/anniversary',
  '/onboarding/complete',
] as const

// 비커플(이별) 전용 단계
const NON_COUPLE_STEPS = ['/onboarding/complete'] as const

type OnboardingStep = (typeof BASE_STEPS)[number] | (typeof COUPLE_STEPS)[number] | (typeof NON_COUPLE_STEPS)[number]

export function useOnboardingNavigation() {
  const navigate = useNavigate()
  const { location } = useRouterState()
  const { refreshUserInfo } = useAuth()
  const { data } = useOnboarding()
  const isCoupleOnboardingFlow = ['IN_RELATIONSHIP', 'SEEING_SOMEONE'].includes(data.relationshipStatus ?? '')

  // 연애 상태에 따른 전체 스텝 계산
  const getOnboardingSteps = (): OnboardingStep[] => {
    const currentPath = location.pathname.replace(/\/$/, '')
    const isCoupleFlowPath = COUPLE_STEPS.includes(currentPath as (typeof COUPLE_STEPS)[number])

    if (isCoupleOnboardingFlow || isCoupleFlowPath) {
      return [...BASE_STEPS, ...COUPLE_STEPS]
    }
    return [...BASE_STEPS, ...NON_COUPLE_STEPS]
  }

  const ONBOARDING_STEPS = getOnboardingSteps()

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
    const currentPath = location.pathname.replace(/\/$/, '')

    // 상대방 MBTI 페이지 이후 조건부 라우팅
    if (currentPath === '/onboarding/partner-mbti') {
      if (isCoupleOnboardingFlow) {
        navigate({ to: '/onboarding/my-code', replace: true })
      } else {
        navigate({ to: '/onboarding/complete', replace: true })
      }
      return true
    }

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
    const currentPath = location.pathname.replace(/\/$/, '')

    // 완료 페이지에서 뒤로가기 시 조건부 라우팅
    if (currentPath === '/onboarding/complete') {
      if (isCoupleOnboardingFlow) {
        navigate({ to: '/onboarding/anniversary', replace: true })
      } else {
        navigate({ to: '/onboarding/partner-mbti', replace: true })
      }
      return true
    }

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

  return {
    goToNextStep,
    goToPreviousStep,
    goToStep,
    goToHome,
    currentStepIndex: getCurrentStepIndex(),
    totalSteps: ONBOARDING_STEPS.length,
    ONBOARDING_STEPS,
    isCouple: data.relationshipStatus === 'IN_RELATIONSHIP',
  }
}
