import { SocialLoginType } from '@bridge/types'

import { amplitude } from '@/shared/analytics'
import bridge from '@/shared/bridge'
import { isWebView } from '@/shared/utils/webview'

import {
  clearWebLoginQuery,
  exchangeWebLoginTicket,
  getWebAccessToken,
  getWebLoginError,
  getWebLoginTicket,
  getWebRefreshToken,
  refreshWebSession,
  revokeWebSession,
  startWebKakaoLogin,
} from './web-session'

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
        const ticket = getWebLoginTicket()
        const loginError = getWebLoginError()

        if (ticket || loginError) {
          try {
            if (loginError) {
              throw new Error('카카오 로그인이 취소되었거나 실패했습니다.')
            }
            await exchangeWebLoginTicket(ticket!)
          } finally {
            clearWebLoginQuery()
          }
        }

        const accessToken = getWebAccessToken()
        if (accessToken) {
          return { authenticated: true, accessToken }
        }

        if (getWebRefreshToken()) {
          const refreshedAccessToken = await refreshWebSession()
          return { authenticated: true, accessToken: refreshedAccessToken }
        }

        return { authenticated: false }
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
      await revokeWebSession()
      return { success: true }
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
      if (type !== 'kakao') {
        throw new Error('웹에서는 카카오 로그인을 이용해 주세요.')
      }

      const deviceId = amplitude.getDeviceId()
      startWebKakaoLogin(deviceId)
      return { success: false }
    }
  }
}

export default new AuthClient()
