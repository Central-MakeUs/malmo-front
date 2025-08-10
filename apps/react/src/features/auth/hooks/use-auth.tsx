import { SocialLoginType } from '@bridge/types'
import {
  MemberDataMemberStateEnum,
  MemberDataLoveTypeCategoryEnum,
  MemberDataProviderEnum,
} from '@data/user-api-axios/api'
import { createContext, ReactNode, useCallback, useEffect, useState, use } from 'react'

import memberService from '@/shared/services/member.service'
import { Skeleton } from '@/shared/ui/skeleton'

import authClient from '../lib/auth-client'

// 멤버 상태 타입
export type MemberState = MemberDataMemberStateEnum | null

// 사용자 정보 타입
export type UserInfo = {
  memberState: MemberState
  provider?: MemberDataProviderEnum
  nickname?: string
  startLoveDate?: string
  loveTypeCategory?: MemberDataLoveTypeCategoryEnum
  anxietyRate?: number
  avoidanceRate?: number
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
  provider: undefined,
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

  // 멤버 상태가 온보딩이 필요한지 여부
  const needsOnboarding = userInfo.memberState === MemberDataMemberStateEnum.BeforeOnboarding

  // 내부에서만 사용할 사용자 정보 조회 함수 (상태 의존성 없음)
  const _fetchUserInfo = async (): Promise<UserInfo | null> => {
    try {
      const memberInfo = await memberService.getMemberInfo()

      if (memberInfo?.data?.data) {
        const newUserInfo: UserInfo = {
          memberState: memberInfo.data.data.memberState || null,
          provider: memberInfo.data.data.provider || undefined,
          nickname: memberInfo.data.data.nickname,
          startLoveDate: memberInfo.data.data.startLoveDate || undefined,
          loveTypeCategory: memberInfo.data.data.loveTypeCategory || undefined,
          anxietyRate: memberInfo.data.data.anxietyRate || undefined,
          avoidanceRate: memberInfo.data.data.avoidanceRate || undefined,
          totalChatRoomCount: memberInfo.data.data.totalChatRoomCount || 0,
          totalCoupleQuestionCount: memberInfo.data.data.totalCoupleQuestionCount || 0,
        }
        setUserInfo(newUserInfo)
        return newUserInfo
      }
      // 데이터가 없는 경우도 실패로 처리
      throw new Error('User info not found')
    } catch {
      // 실패 시 인증 상태를 확실히 초기화
      setAuthenticated(false)
      setUserInfo(initialUserInfo)
      return null
    }
  }

  const socialLogin = useCallback(
    async (type: SocialLoginType) => {
      try {
        const result = await authClient.socialLogin(type)

        if (result.success) {
          setAuthenticated(true) // 먼저 인증 상태를 true로 설정
          const currentUserInfo = await _fetchUserInfo() // 그 다음 사용자 정보를 가져옴

          const currentNeedsOnboarding = currentUserInfo?.memberState === MemberDataMemberStateEnum.BeforeOnboarding

          return {
            ...result,
            needsOnboarding: currentNeedsOnboarding,
          }
        }
        return result
      } catch (e) {
        setAuthenticated(false)
        setUserInfo(initialUserInfo)
        throw e
      }
    },
    [] // 의존성 배열을 비워 stale closure 문제 해결
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

  // 외부에서 사용자 정보를 새로고침할 때 사용하는 함수
  const refreshUserInfo = useCallback(async () => {
    if (authenticated) {
      return await _fetchUserInfo()
    }
    return null
  }, [authenticated]) // authenticated 상태에 의존

  useEffect(() => {
    const initAuth = async () => {
      try {
        const result = await authClient.getAuth()
        if (result?.authenticated) {
          setAuthenticated(true)
          await _fetchUserInfo() // 앱 시작 시 사용자 정보 조회
        }
      } catch {
        setAuthenticated(false)
        setUserInfo(initialUserInfo)
      } finally {
        setLoading(false)
      }
    }
    initAuth()
  }, [])

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
