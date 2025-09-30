import { authClient } from '../lib/auth-client'
import { AuthStorage } from '../lib/auth-storage'
import { logAxiosError } from '../lib/error-utils'
import { persistAuthSession } from '../lib/persist-auth-session'

export async function refreshToken(): Promise<{ accessToken: string | null }> {
  try {
    const token = await AuthStorage.getRefreshToken()
    const response = await authClient.post('/refresh', {
      refreshToken: token,
    })

    const tokens = response.data?.data

    if (!tokens?.accessToken || !tokens?.refreshToken) {
      console.error('리프레시 응답에 토큰이 없습니다:', response.data)
      return { accessToken: null }
    }

    await persistAuthSession(
      {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
      { fetchProfile: false }
    )

    return {
      accessToken: tokens.accessToken,
    }
  } catch (apiError) {
    await AuthStorage.clearSession()
    await AuthStorage.setCurrentUserEmail(null)

    logAxiosError(apiError, '리프레시 토큰 API 호출')

    return { accessToken: null }
  }
}
