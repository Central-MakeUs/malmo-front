// 현재 환경이 웹뷰인지 확인하는 함수
export const isWebView = (): boolean => {
  return typeof window !== 'undefined' && window.ReactNativeWebView !== undefined
}
