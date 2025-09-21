import axios from 'axios'

import { AuthStorage } from '../lib/auth-storage'

export async function logout(): Promise<{ success: boolean; message?: string }> {
  try {
    const baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL
    const accessToken = await AuthStorage.getAccessToken()

    // 로그아웃 요청
    if (baseUrl) {
      try {
        await axios.post(
          `${baseUrl}/logout`,
          {},
          {
            headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
            timeout: 20000,
          }
        )
      } catch (apiError) {
        console.error('로그아웃 API 호출 오류:', apiError)
      }
    }

    // 로컬 인증 정보 초기화
    await AuthStorage.clearAuth()
    await AuthStorage.setCurrentUserEmail(null)

    return { success: true, message: '로그아웃 성공' }
  } catch (error) {
    console.error('로그아웃 오류:', error)
    return {
      success: false,
      message: `로그아웃 중 오류가 발생했습니다: ${error instanceof Error ? error.message : String(error)}`,
    }
  }
}
