import React, { createContext, useContext, useState, ReactNode } from 'react'
import signUpService from '@/shared/services/sign-up.service'
import { formatDate } from '@/shared/utils'
import { useAuth } from '@/features/auth'

// 온보딩 데이터 타입 정의
interface OnboardingData {
  // 약관 동의 데이터
  termsAgreements: Record<number, boolean>

  // 사용자 정보
  nickname: string

  // 기념일 정보
  anniversary: Date | null

  // 커플 연결 정보
  inviteCode: string | null
  partnerCode: string | null
}

interface OnboardingContextType {
  // 온보딩 데이터
  data: OnboardingData

  // 약관 동의 업데이트
  updateTermsAgreements: (agreements: Record<number, boolean>) => void

  // 닉네임 업데이트
  updateNickname: (nickname: string) => void

  // 기념일 업데이트
  updateAnniversary: (date: Date) => void

  // 초대 코드 업데이트
  updateInviteCode: (code: string) => void

  // 파트너 코드 업데이트
  updatePartnerCode: (code: string) => void

  // 온보딩 완료 처리
  completeOnboarding: () => Promise<boolean>
}

// 기본값 설정
const defaultOnboardingData: OnboardingData = {
  termsAgreements: {},
  nickname: '',
  anniversary: null,
  inviteCode: null,
  partnerCode: null,
}

// 컨텍스트 생성
const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined)

// 컨텍스트 프로바이더 컴포넌트
export function OnboardingProvider({ children }: { children: ReactNode }) {
  const { refreshUserInfo } = useAuth()
  const [data, setData] = useState<OnboardingData>(defaultOnboardingData)

  // 약관 동의 업데이트
  const updateTermsAgreements = (agreements: Record<number, boolean>) => {
    setData((prev) => ({
      ...prev,
      termsAgreements: agreements,
    }))
  }

  // 닉네임 업데이트
  const updateNickname = (nickname: string) => {
    setData((prev) => ({
      ...prev,
      nickname,
    }))
  }

  // 기념일 업데이트
  const updateAnniversary = (date: Date) => {
    setData((prev) => ({
      ...prev,
      anniversary: date,
    }))
  }

  // 초대 코드 업데이트
  const updateInviteCode = (code: string) => {
    setData((prev) => ({
      ...prev,
      inviteCode: code,
    }))
  }

  // 파트너 코드 업데이트
  const updatePartnerCode = (code: string) => {
    setData((prev) => ({
      ...prev,
      partnerCode: code,
    }))
  }

  // 온보딩 완료 처리
  const completeOnboarding = async () => {
    try {
      // 여기서 API 호출
      const requestBody = {
        nickname: data.nickname,
        loveStartDate: data.anniversary ? formatDate(data.anniversary) : null,
        terms: Object.entries(data.termsAgreements).map(([termsId, isAgreed]) => ({
          termsId: Number(termsId),
          isAgreed,
        })),
      }

      // 회원가입 API 호출
      await signUpService.requestSignUp(requestBody)

      // 멤버 상태 갱신
      await refreshUserInfo()

      return true
    } catch (error) {
      return false
    }
  }

  return (
    <OnboardingContext.Provider
      value={{
        data,
        updateTermsAgreements,
        updateNickname,
        updateAnniversary,
        updateInviteCode,
        updatePartnerCode,
        completeOnboarding,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  )
}

// 커스텀 훅
export function useOnboarding() {
  const context = useContext(OnboardingContext)
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider')
  }
  return context
}
