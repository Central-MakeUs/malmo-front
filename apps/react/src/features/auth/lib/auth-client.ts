import { SocialLoginType } from '@bridge/types'

import { amplitude } from '@/shared/analytics'
import bridge from '@/shared/bridge'
import { isWebView } from '@/shared/utils/webview'

// 인증 관련 기능을 제공하는 클라이언트
class AuthClient {
  // 현재 인증 상태를 확인
  async getAuth() {
    try {
      // 웹뷰 환경인지 확인
      if (isWebView()) {
        // 네이티브에서 인증 상태 가져오기
        const { isLoggedIn } = await bridge.getAuthStatus()

        if (isLoggedIn) {
          // 네이티브에서 토큰 가져오기
          const { accessToken } = await bridge.getAuthToken()
          console.log('Access Token:', accessToken)

          if (!accessToken) {
            return { authenticated: false }
          }

          return { authenticated: true, accessToken }
        }

        return { authenticated: false }
      } else {
        // Todo
      }
    } catch {
      return { authenticated: false }
    }
  }

  async logout({ clearAll }: { clearAll?: boolean } = {}) {
    if (isWebView()) {
      try {
        const result = await bridge.logout({ clearAll })
        if (!result.success) {
          throw new Error(result.message || '로그아웃에 실패했습니다.')
        }
        return result
      } catch (error) {
        throw error
      }
    } else {
      throw new Error('웹 환경에서는 로그아웃이 지원되지 않습니다.')
    }
  }

  // 소셜 로그인 처리
  async socialLogin(type: SocialLoginType) {
    if (isWebView()) {
      try {
        // 네이티브 소셜 로그인 사용
        const deviceId = amplitude.getDeviceId()
        const result = await bridge.socialLogin(type, deviceId ? { deviceId } : undefined)

        if (!result.success) {
          throw new Error(result.message || '소셜 로그인에 실패했습니다.')
        }

        return result
      } catch (error) {
        throw error
      }
    } else {
      throw new Error('웹 환경에서는 소셜 로그인이 지원되지 않습니다.')
    }
  }
}

export default new AuthClient()
