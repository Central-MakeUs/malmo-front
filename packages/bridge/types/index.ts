// 소셜 로그인 타입
export type SocialLoginType = 'kakao' | 'apple'

// 소셜 로그인 결과 타입
export interface SocialLoginResult {
  success: boolean
  message?: string
}

// 브릿지 스토어 타입 (상태)
export interface BridgeStore {
  isLoggedIn: boolean
  overlayState: {
    visible: boolean
    opacity: number
  }
  statusBarColor: string
}

// 브릿지 액션 타입 (함수)
export interface BridgeActions {
  socialLogin(type: SocialLoginType): Promise<SocialLoginResult>
  getAuthStatus(): Promise<{ isLoggedIn: boolean }>
  getAuthToken(): Promise<{ accessToken: string | null }>
  logout(): Promise<{ success: boolean; message?: string }>
  notifyTokenExpired(): Promise<{ accessToken: string | null }>
  toggleOverlay(level: 0 | 1 | 2): Promise<void>
  changeStatusBarColor(color: string): Promise<void>
  saveChatTutorialSeen(): Promise<void>
  getChatTutorialSeen(): Promise<boolean>
  openWebView(url: string): Promise<void>
  getQuestionHelp(): Promise<boolean>
  setQuestionHelpFalse(): Promise<void>
}
