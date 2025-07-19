import { BridgeStore, linkBridge } from '@webview-bridge/web'
import { SocialLoginType, SocialLoginResult } from '@bridge/types'

// 웹에서 사용할 브릿지 타입 정의
export interface WebBridge extends BridgeStore<WebBridge> {
  // 상태
  isLoggedIn: boolean

  // 액션
  socialLogin(type: SocialLoginType): Promise<SocialLoginResult>
  getAuthStatus(): Promise<{ isLoggedIn: boolean }>
  getAuthToken(): Promise<{ accessToken: string | null }>
  logout(): Promise<{ success: boolean; message?: string }>
  notifyTokenExpired(): Promise<{ accessToken: string | null }>
  [key: string]: any
}

// 브릿지 인스턴스 생성
export const bridge = linkBridge<WebBridge>({
  throwOnError: true,
  timeout: 20000,
  initialBridge: {
    isLoggedIn: false,
    socialLogin: async () => ({ success: false }),
    getAuthStatus: async () => ({ isLoggedIn: false }),
    getAuthToken: async () => ({ accessToken: null }),
    logout: async () => ({ success: false, message: '로그아웃 실패' }),
    notifyTokenExpired: async () => ({ accessToken: null }),
    toggleOverlay: async (level?: number) => {},
  },
})

export default bridge
