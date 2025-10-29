import { Bridge, bridge, postMessageSchema } from '@webview-bridge/react-native'
import { z } from 'zod'
import { BridgeStore, BridgeActions, SocialLoginType, SocialLoginResult, SocialLoginOptions } from '@bridge/types'
import { processSocialLogin, SocialLoginProvider } from '../features/auth/lib/social-login'
import { kakaoProvider } from '../features/auth/social/kakao-provider'
import { appleProvider } from '../features/auth/social/apple-provider'
import { AuthStorage } from '../features/auth/lib/auth-storage'
import { refreshToken } from '../features/auth/token/refresh-token'
import { logout } from '../features/auth/token/logout'

export type AppBridgeState = Bridge & BridgeStore & BridgeActions

const socialProviders: Record<SocialLoginType, SocialLoginProvider> = {
  kakao: kakaoProvider,
  apple: appleProvider,
}

export const appBridge = bridge<AppBridgeState>(({ get, set }) => {
  const actions: BridgeActions = {
    async socialLogin(type: SocialLoginType, options?: SocialLoginOptions): Promise<SocialLoginResult> {
      const provider = socialProviders[type]

      if (!provider) {
        return {
          success: false,
          message: '지원하지 않는 소셜 로그인 유형입니다.',
        }
      }

      const result = await processSocialLogin(provider, options)

      if (result.success) {
        set({ isLoggedIn: true })
      }

      return result
    },
    async logout({ clearAll }: { clearAll?: boolean }): Promise<{ success: boolean; message?: string }> {
      const result = await logout({ clearAll })
      if (result.success) {
        set({ isLoggedIn: false })
      }
      return result
    },

    async getAuthStatus(): Promise<{ isLoggedIn: boolean }> {
      const isLoggedIn = await AuthStorage.isAuthenticated()
      return { isLoggedIn }
    },

    async getAuthToken(): Promise<{ accessToken: string | null }> {
      const accessToken = await AuthStorage.getAccessToken()
      return { accessToken }
    },

    async notifyTokenExpired(): Promise<{ accessToken: string | null }> {
      const { accessToken } = await refreshToken()
      return { accessToken }
    },

    async saveChatTutorialSeen(): Promise<void> {
      await AuthStorage.setChatTutorialSeen(true)
    },

    async getChatTutorialSeen(): Promise<boolean> {
      const seen = await AuthStorage.getChatTutorialSeen()
      return seen
    },

    async setKeyboardHeight(height: number): Promise<void> {
      set({ keyboardHeight: height })
    },

    async setModalOpen(isOpen: boolean): Promise<void> {
      set({ isModalOpen: isOpen })
    },

    async openWebView(url: string): Promise<void> {
      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { Linking } = require('react-native')
        await Linking.openURL(url)
      } catch (error) {
        console.error('WebView 열기 오류:', error)
      }
    },

    async getQuestionHelp(): Promise<boolean> {
      const helpSeen = await AuthStorage.getQuestionHelp()
      return helpSeen
    },

    async setQuestionHelpFalse(): Promise<void> {
      await AuthStorage.setQuestionHelp(false)
    },

    async getIntroSeen(): Promise<boolean> {
      const seen = await AuthStorage.getIntroSeen()
      return seen
    },

    async setIntroSeen(): Promise<void> {
      await AuthStorage.setIntroSeen()
    },
  }

  return {
    isLoggedIn: false,
    keyboardHeight: 0,
    isModalOpen: false,
    ...actions,
  }
})

export const appSchema = postMessageSchema({
  // 소셜 로그인 스키마
  socialLogin: {
    validate: (value) => {
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
  // 토큰 만료 알림 스키마
  notifyTokenExpired: {
    validate: () => {
      return {}
    },
  },
  openWebView: {
    validate: (value) => {
      return z
        .object({
          url: z.string().url(),
        })
        .parse(value)
    },
  },
  getIntroSeen: {
    validate: () => {
      return {}
    },
  },
  setIntroSeen: {
    validate: () => {
      return {}
    },
  },
})

export type AppBridge = typeof appBridge
export type AppPostMessageSchema = typeof appSchema
