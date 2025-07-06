import { Bridge, bridge, postMessageSchema } from '@webview-bridge/react-native'
import { z } from 'zod'
import { BridgeStore, BridgeActions, SocialLoginType, SocialLoginResult } from '@bridge/types'
import { kakaoLogin } from '../features/auth/social/kakao-login'
import { appleLogin } from '../features/auth/social/apple-login'

export type AppBridgeState = Bridge & BridgeStore & BridgeActions

export const appBridge = bridge<AppBridgeState>(({ set }) => {
  const actions: BridgeActions = {
    async socialLogin(type: SocialLoginType): Promise<SocialLoginResult> {
      try {
        let result: SocialLoginResult

        if (type === 'kakao') {
          result = await kakaoLogin()
        } else if (type === 'apple') {
          result = await appleLogin()
        } else {
          return {
            success: false,
            message: '지원하지 않는 소셜 로그인 유형입니다.',
          }
        }

        // 로그인 성공 시 상태 업데이트
        if (result.success) {
          console.log('로그인 성공, 상태 업데이트')
          set({ isLoggedIn: true })
        } else {
          console.log('로그인 실패, 상태 유지')
        }

        console.log('브릿지 socialLogin 액션 결과 반환:', result)
        return result
      } catch (error) {
        console.error('소셜 로그인 오류:', error)
        return {
          success: false,
          message: `소셜 로그인 중 오류가 발생했습니다: ${error instanceof Error ? error.message : String(error)}`,
        }
      }
    },

    async getAuthStatus(): Promise<{ isLoggedIn: boolean }> {
      return { isLoggedIn: false }
    },

    async getAuthToken(): Promise<{ accessToken: string | null }> {
      return { accessToken: null }
    },
  }

  return {
    isLoggedIn: false,
    ...actions,
  }
})

export const appSchema = postMessageSchema({
  // 소셜 로그인 스키마
  socialLogin: {
    validate: (value) => {
      console.log('소셜 로그인 스키마 검증:', value)
      return z
        .object({
          type: z.enum(['kakao', 'apple']),
        })
        .parse(value)
    },
  },
  // 인증 상태 스키마
  getAuthStatus: {
    validate: () => {
      return {}
    },
  },
  // 인증 토큰 스키마
  getAuthToken: {
    validate: () => {
      return {}
    },
  },
})

export type AppBridge = typeof appBridge
export type AppPostMessageSchema = typeof appSchema
