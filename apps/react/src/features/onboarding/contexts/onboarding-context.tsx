import { useMutation } from '@tanstack/react-query'
import React, { createContext, useContext, useState, ReactNode } from 'react'

import signUpService from '@/shared/services/sign-up.service'

import type { SignUpRequestDto } from '@data/user-api-axios/api'

// import { useAuth } from '@/features/auth'

// 연애 상태 타입 정의
export type RelationshipStatus = NonNullable<SignUpRequestDto['relationshipStatus']>

// 온보딩 데이터 타입 정의
interface OnboardingData {
  // 약관 동의 데이터
  termsAgreements: Record<number, boolean>

  // 사용자 정보
  nickname: string

  // 연애 상태
  relationshipStatus: RelationshipStatus | null

  // MBTI
  personalityType: string | null

  // 상대방 MBTI
  otherPersonalityType: string | null

  // 기념일 정보
  anniversary: Date | null

  // 커플 연결 정보
  partnerCode: string | null
}

interface OnboardingContextType {
  // 온보딩 데이터
  data: OnboardingData

  // 온보딩 완료 여부(회원가입 API 성공 기준)
  isOnboardingCompleted: boolean

  // 약관 동의 업데이트
  updateTermsAgreements: (agreements: Record<number, boolean>) => void

  // 닉네임 업데이트
  updateNickname: (nickname: string) => void

  // 연애 상태 업데이트
  updateRelationshipStatus: (status: RelationshipStatus) => void

  // MBTI 업데이트
  updatePersonalityType: (mbti: string) => void

  // 상대방 MBTI 업데이트
  updateOtherPersonalityType: (mbti: string) => void

  // 기념일 업데이트
  updateAnniversary: (date: Date) => void

  // 파트너 코드 업데이트
  updatePartnerCode: (code: string) => void

  // 온보딩 완료 처리
  completeOnboarding: (overrides?: { relationshipStatus?: RelationshipStatus }) => Promise<boolean>
}

// 기본값 설정
const defaultOnboardingData: OnboardingData = {
  termsAgreements: {},
  nickname: '',
  relationshipStatus: null,
  personalityType: null,
  otherPersonalityType: null,
  anniversary: null,
  partnerCode: null,
}

// 컨텍스트 생성
const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined)

// 컨텍스트 프로바이더 컴포넌트
export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<OnboardingData>(defaultOnboardingData)
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(false)

  const signUpMutation = useMutation({
    ...signUpService.signUpMutation(),
  })

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

  // 연애 상태 업데이트
  const updateRelationshipStatus = (status: RelationshipStatus) => {
    setData((prev) => ({
      ...prev,
      relationshipStatus: status,
    }))
  }

  // MBTI 업데이트
  const updatePersonalityType = (mbti: string) => {
    setData((prev) => ({
      ...prev,
      personalityType: mbti,
    }))
  }

  // 상대방 MBTI 업데이트
  const updateOtherPersonalityType = (mbti: string) => {
    setData((prev) => ({
      ...prev,
      otherPersonalityType: mbti,
    }))
  }

  // 기념일 업데이트
  const updateAnniversary = (date: Date) => {
    setData((prev) => ({
      ...prev,
      anniversary: date,
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
  const completeOnboarding = async (overrides?: { relationshipStatus?: RelationshipStatus }) => {
    if (isOnboardingCompleted) {
      return true
    }

    try {
      // 여기서 API 호출
      const requestBody: SignUpRequestDto = {
        nickname: data.nickname,
        terms: Object.entries(data.termsAgreements).map(([termsId, isAgreed]) => ({
          termsId: Number(termsId),
          isAgreed,
        })),
      }

      const effectiveRelationshipStatus = overrides?.relationshipStatus ?? data.relationshipStatus
      if (effectiveRelationshipStatus) {
        requestBody.relationshipStatus = effectiveRelationshipStatus
      }

      if (data.personalityType) {
        requestBody.personalityType = data.personalityType
      }

      if (data.otherPersonalityType) {
        requestBody.otherPersonalityType = data.otherPersonalityType
      }

      // 회원가입 API 호출
      await signUpMutation.mutateAsync(requestBody)
      setIsOnboardingCompleted(true)

      return true
    } catch {
      return false
    }
  }

  return (
    <OnboardingContext.Provider
      value={{
        data,
        isOnboardingCompleted,
        updateTermsAgreements,
        updateNickname,
        updateRelationshipStatus,
        updatePersonalityType,
        updateOtherPersonalityType,
        updateAnniversary,
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
