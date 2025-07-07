import { Bridge, bridge, postMessageSchema } from '@webview-bridge/react-native'
import { BridgeStore, BridgeActions } from '@bridge/types'

export type AppBridgeState = Bridge & BridgeStore & BridgeActions

export const appBridge = bridge<AppBridgeState>(({ set }) => {
  const actions: BridgeActions = {
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
  // 로그아웃 스키마
  logout: {
    validate: () => {
      return {}
    },
  },
})

export type AppBridge = typeof appBridge
export type AppPostMessageSchema = typeof appSchema
