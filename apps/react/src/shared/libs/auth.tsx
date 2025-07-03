import { LoginFormType } from '@/features/auth/model'
import { Skeleton } from '@ui/common/components/skeleton'
import { createContext, ReactNode, use, useCallback, useEffect, useState } from 'react'
import memberService from '../services/member.service'
import { MemberDataMemberStateEnum } from '@data/user-api-axios/api'

// TODO 개발전이여서, Optional로 설정
export type User = {
  memberState?: MemberDataMemberStateEnum
  loveTypeTitle?: string
  avoidanceRate?: number
  anxietyRate?: number
  nickname?: string
  email?: string
}

export interface AuthContext {
  authenticated: boolean
  login: (data: LoginFormType) => Promise<void>
  logout: () => Promise<void>
  user?: User | null
}

const AuthContext = createContext<AuthContext | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const authenticated = !!user

  const logout = useCallback(async () => {
    // await authService.authControllerLogout()
    setUser(null)
  }, [])

  const login = useCallback(async (data: LoginFormType) => {
    // try {
    //   await authService.signIn(data)
    //   const { data: user } = await authService.getAuth()
    //   if (user) {
    //     setUser({
    //       id: user.id,
    //       name: user.name ?? '',
    //     })
    //   }
    // } catch (e) {
    //   throw e
    // }
  }, [])

  useEffect(() => {
    memberService
      .findOne()
      .then(({ data }) => {
        if (data) setUser({ ...data })
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  if (loading) return <Skeleton />

  return <AuthContext.Provider value={{ authenticated, user, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = use(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
