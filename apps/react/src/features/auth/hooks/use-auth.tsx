import { Skeleton } from '@ui/common/components/skeleton'
import { createContext, ReactNode, useCallback, useEffect, useState, use } from 'react'
import authClient from '../lib/auth-client'
import { SocialLoginType } from '@bridge/types'

export interface AuthContext {
  authenticated: boolean
  socialLogin: (type: SocialLoginType) => Promise<{ success: boolean; message?: string }>
  logout: () => Promise<{ success: boolean; message?: string }>
}

const AuthContext = createContext<AuthContext | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)

  const socialLogin = useCallback(async (type: SocialLoginType) => {
    try {
      const result = await authClient.socialLogin(type)
      if (result.success) {
        setAuthenticated(true)
      }
      return result
    } catch (e) {
      throw e
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await authClient.logout()
      setAuthenticated(false)
      return { success: true }
    } catch (e) {
      throw e
    }
  }, [])

  useEffect(() => {
    authClient
      .getAuth()
      .then((result) => {
        if (result && 'authenticated' in result) {
          setAuthenticated(result.authenticated)
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  if (loading) return <Skeleton />

  return <AuthContext.Provider value={{ authenticated, socialLogin, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = use(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
