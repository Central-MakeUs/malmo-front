import { Skeleton } from '@ui/common/components/skeleton'
import { createContext, ReactNode, useCallback, useEffect, useState, use } from 'react'
import authClient from '../lib/auth-client'
import { SocialLoginType } from '@bridge/types'
import memberService from '@/shared/services/member.service'
import { MemberData, MemberDataMemberStateEnum, MemberDataLoveTypeCategoryEnum } from '@data/user-api-axios/api'

// 멤버 상태 타입
export type MemberState = MemberDataMemberStateEnum | null

// 사용자 정보 타입
export type UserInfo = {
  memberState: MemberState
  nickname?: string
  startLoveDate?: string
  // 애착 유형 관련 필드
  loveTypeCategory?: MemberDataLoveTypeCategoryEnum
  anxietyRate?: number
  avoidanceRate?: number
  // 통계 데이터
  totalChatRoomCount?: number
  totalCoupleQuestionCount?: number
}

export interface AuthContext {
  authenticated: boolean
  userInfo: UserInfo
  needsOnboarding: boolean
  socialLogin: (type: SocialLoginType) => Promise<{
    success: boolean
    message?: string
    needsOnboarding?: boolean
  }>
  logout: () => Promise<{ success: boolean; message?: string }>
  refreshUserInfo: () => Promise<UserInfo | null>
}

const AuthContext = createContext<AuthContext | null>(null)

// 초기 사용자 정보 상태
const initialUserInfo: UserInfo = {
  memberState: null,
  nickname: undefined,
  startLoveDate: undefined,
  loveTypeCategory: undefined,
  anxietyRate: undefined,
  avoidanceRate: undefined,
  totalChatRoomCount: undefined,
  totalCoupleQuestionCount: undefined,
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)
  const [userInfo, setUserInfo] = useState<UserInfo>(initialUserInfo)

  useEffect(() => {
    refreshUserInfo()
  }, [])

  // 멤버 상태가 온보딩이 필요한지 여부
  const needsOnboarding = userInfo.memberState === MemberDataMemberStateEnum.BeforeOnboarding

  // 사용자 정보 조회 함수
  const fetchUserInfo = useCallback(async () => {
    if (!authenticated) {
      setUserInfo(initialUserInfo)
      return null
    }
    try {
      const memberInfo = await memberService.findOne()

      if (memberInfo?.data) {
        const newUserInfo: UserInfo = {
          memberState: memberInfo.data.memberState || null,
          nickname: memberInfo.data.nickname,
          startLoveDate: memberInfo.data.startLoveDate || undefined,
          loveTypeCategory: memberInfo.data.loveTypeCategory || undefined,
          anxietyRate: memberInfo.data.anxietyRate || undefined,
          avoidanceRate: memberInfo.data.avoidanceRate || undefined,
          totalChatRoomCount: memberInfo.data.totalChatRoomCount || 5, // 임시 기본값
          totalCoupleQuestionCount: memberInfo.data.totalCoupleQuestionCount || 10, // 임시 기본값
        }

        setUserInfo(newUserInfo)
        return newUserInfo
      }

      return null
    } catch (error) {
      return null
    }
  }, [authenticated])

  // 사용자 정보 갱신 함수
  const refreshUserInfo = useCallback(async () => {
    return await fetchUserInfo()
  }, [fetchUserInfo])

  const socialLogin = useCallback(
    async (type: SocialLoginType) => {
      try {
        // 소셜 로그인 시도
        const result = await authClient.socialLogin(type)

        if (result.success) {
          // 인증 상태 업데이트
          setAuthenticated(true)

          // 사용자 정보 조회
          const currentUserInfo = await fetchUserInfo()

          // 온보딩 필요 여부 확인
          const needsOnboarding = currentUserInfo?.memberState === MemberDataMemberStateEnum.BeforeOnboarding

          return {
            ...result,
            needsOnboarding,
          }
        }

        return result
      } catch (e) {
        throw e
      }
    },
    [fetchUserInfo]
  )

  const logout = useCallback(async () => {
    try {
      await authClient.logout()
      setAuthenticated(false)
      setUserInfo(initialUserInfo)
      return { success: true }
    } catch (e) {
      throw e
    }
  }, [])

  useEffect(() => {
    const initAuth = async () => {
      try {
        const result = await authClient.getAuth()

        if (result && 'authenticated' in result) {
          setAuthenticated(result.authenticated)
          // 인증 상태 확인 후 사용자 정보 조회
          if (result.authenticated) {
            await fetchUserInfo()
          }
        }
      } catch (error) {
        //TODO: 인증 상태 조회 실패 시 처리
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [fetchUserInfo])

  if (loading) return <Skeleton />

  return (
    <AuthContext.Provider
      value={{
        authenticated,
        userInfo,
        needsOnboarding,
        socialLogin,
        logout,
        refreshUserInfo,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = use(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
