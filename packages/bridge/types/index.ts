// 브릿지 스토어 타입 (상태)
export interface BridgeStore {
  isLoggedIn: boolean
}

// 브릿지 액션 타입 (함수)
export interface BridgeActions {
  getAuthStatus(): Promise<{ isLoggedIn: boolean }>
  getAuthToken(): Promise<{ accessToken: string | null }>
}
