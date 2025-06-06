// import { Skeleton } from '@ui/common/components/skeleton'
// import React, { createContext, ReactNode, use, useCallback, useEffect, useState } from 'react'
// import authService from '../services/auth.service'

// export type User = {
//   id: number
//   nickname: string
// }

// export interface AuthContext {
//   authenticated: boolean
//   login: (data: { name: string; password: string; remember?: boolean }) => Promise<void>
//   logout: () => Promise<void>
//   user?: User | null
// }

// const AuthContext = createContext<AuthContext | null>(null)

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [loading, setLoading] = useState(true)
//   const [user, setUser] = useState<User | null>(null)
//   const authenticated = !!user

//   const logout = useCallback(async () => {
//     await authService.authControllerLogout()
//     setUser(null)
//   }, [])

//   const login = useCallback(async (data: { name: string; password: string }) => {
//     try {
//       const user = await authService.login(data)
//       setUser({
//         id: user.id,
//         nickname: user.nickname,
//       })
//     } catch (e) {
//       throw e
//     }
//   }, [])

//   useEffect(() => {
//     authService
//       .getAuth()
//       .then(({ data }) => {
//         if (data) {
//           setUser({
//             id: data.id,
//             nickname: data.nickname,
//           })
//         }
//       })
//       .finally(() => {
//         setLoading(false)
//       })
//   }, [])
//   if (loading) return <Skeleton />

//   return <AuthContext.Provider value={{ authenticated, user, login, logout }}>{children}</AuthContext.Provider>
// }

// export function useAuth() {
//   const context = use(AuthContext)
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider')
//   }
//   return context
// }
