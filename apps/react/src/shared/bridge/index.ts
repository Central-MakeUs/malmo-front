import { BridgeStore, linkBridge } from '@webview-bridge/web'

// 브릿지 타입 정의
export interface WebBridge extends BridgeStore<WebBridge> {
  // 상태
  isLoggedIn: boolean

  // 액션
  getAuthStatus(): Promise<{ isLoggedIn: boolean }>
  getAuthToken(): Promise<{ accessToken: string | null }>

  [key: string]: any
}

// 브릿지 인스턴스 생성
export const bridge = linkBridge<WebBridge>({
  throwOnError: true,
  timeout: 20000,
  initialBridge: {
    isLoggedIn: false,
    getAuthStatus: async () => ({ isLoggedIn: false }),
    getAuthToken: async () => ({ accessToken: null }),
  },
})

// 브릿지 인스턴스 싱글톤으로 내보내기
export default bridge
