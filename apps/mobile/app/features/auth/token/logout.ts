import { authClient } from '../lib/auth-client'
import { AuthStorage } from '../lib/auth-storage'
import { formatUnknownError, logAxiosError } from '../lib/error-utils'

export async function logout({ clearAll }: { clearAll?: boolean }): Promise<{ success: boolean; message?: string }> {
  try {
    const accessToken = await AuthStorage.getAccessToken()

    try {
      await authClient.post(
        '/logout',
        {},
        {
          headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
        }
      )
    } catch (apiError) {
      logAxiosError(apiError, '로그아웃 API 호출')
    }

    if (clearAll) {
      await AuthStorage.clearAuth()
    } else {
      await AuthStorage.clearSession()
    }
    await AuthStorage.setCurrentUserEmail(null)

    return { success: true, message: '로그아웃 성공' }
  } catch (error) {
    console.error('로그아웃 오류:', error)
    return {
      success: false,
      message: formatUnknownError(error, '로그아웃 중 오류가 발생했습니다'),
    }
  }
}
