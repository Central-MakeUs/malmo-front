import { SocialLoginType, SocialLoginResult } from '@bridge/types'
import { BridgeStore, linkBridge } from '@webview-bridge/web'

// 웹에서 사용할 브릿지 타입 정의
export interface WebBridge extends BridgeStore<WebBridge> {
  // 상태
  isLoggedIn: boolean
  keyboardHeight: number
  isModalOpen: boolean

  // 액션
  socialLogin(type: SocialLoginType): Promise<SocialLoginResult>
  getAuthStatus(): Promise<{ isLoggedIn: boolean }>
  getAuthToken(): Promise<{ accessToken: string | null }>
  logout({ clearAll }: { clearAll?: boolean }): Promise<{ success: boolean; message?: string }>
  notifyTokenExpired(): Promise<{ accessToken: string | null }>
  setCurrentUserEmail(email: string | null): Promise<void>
  saveChatTutorialSeen(): Promise<void>
  getChatTutorialSeen(): Promise<boolean>
  openWebView(url: string): Promise<void>
  getQuestionHelp(): Promise<boolean>
  setQuestionHelpFalse(): Promise<void>
  getIntroSeen(): Promise<boolean>
  setIntroSeen(): Promise<void>
  setModalOpen(isOpen: boolean): Promise<void>
  [key: string]: any
}

// 브릿지 인스턴스 생성
export const bridge = linkBridge<WebBridge>({
  throwOnError: true,
  timeout: 20000,
  initialBridge: {
    isLoggedIn: false,
    keyboardHeight: 0,
    isModalOpen: false,
    socialLogin: async () => ({ success: false }),
    getAuthStatus: async () => ({ isLoggedIn: false }),
    getAuthToken: async () => ({ accessToken: null }),
    logout: async () => ({ success: false, message: '로그아웃 실패' }),
    notifyTokenExpired: async () => ({ accessToken: null }),
    setCurrentUserEmail: async () => {},
    saveChatTutorialSeen: async () => {},
    getChatTutorialSeen: async () => false,
    openWebView: async (url: string) => {
      // 웹에서는 새 창으로 열기
      window.open(url, '_blank')
    },
    getQuestionHelp: async () => true,
    setQuestionHelpFalse: async () => {},
    getIntroSeen: async () => {
      // 웹에서는 localStorage 사용
      return localStorage.getItem('intro_seen') === 'true'
    },
    setIntroSeen: async () => {
      // 웹에서는 localStorage 사용
      localStorage.setItem('intro_seen', 'true')
    },
    setModalOpen: async () => {},
  },
})

export default bridge
