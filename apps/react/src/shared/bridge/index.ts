import { BridgeStore, linkBridge } from '@webview-bridge/web'
import { SocialLoginType, SocialLoginResult } from '@bridge/types'

// 웹에서 사용할 브릿지 타입 정의
export interface WebBridge extends BridgeStore<WebBridge> {
  // 상태
  isLoggedIn: boolean
  keyboardHeight: number

  // 액션
  socialLogin(type: SocialLoginType): Promise<SocialLoginResult>
  getAuthStatus(): Promise<{ isLoggedIn: boolean }>
  getAuthToken(): Promise<{ accessToken: string | null }>
  logout(): Promise<{ success: boolean; message?: string }>
  notifyTokenExpired(): Promise<{ accessToken: string | null }>
  toggleOverlay(level?: number): Promise<void>
  changeStatusBarColor(color?: string): Promise<void>
  saveChatTutorialSeen(): Promise<void>
  getChatTutorialSeen(): Promise<boolean>
  [key: string]: any
}

// 브릿지 인스턴스 생성
export const bridge = linkBridge<WebBridge>({
  throwOnError: true,
  timeout: 20000,
  initialBridge: {
    isLoggedIn: false,
    keyboardHeight: 0,
    socialLogin: async () => ({ success: false }),
    getAuthStatus: async () => ({ isLoggedIn: false }),
    getAuthToken: async () => ({ accessToken: null }),
    logout: async () => ({ success: false, message: '로그아웃 실패' }),
    notifyTokenExpired: async () => ({ accessToken: null }),
    toggleOverlay: async (level?: number) => {},
    changeStatusBarColor: async (color?: string) => {},
    saveChatTutorialSeen: async () => {},
    getChatTutorialSeen: async () => false,
  },
})

export default bridge
