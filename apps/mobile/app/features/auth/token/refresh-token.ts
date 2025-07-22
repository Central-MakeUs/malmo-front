import axios, { isAxiosError } from 'axios'
import { AuthStorage } from '../lib/auth-storage'

export async function refreshToken(): Promise<{ accessToken: string | null }> {
  try {
    const token = await AuthStorage.getRefreshToken()
    const apiResponse = await axios.post(`${process.env.EXPO_PUBLIC_API_BASE_URL}/refresh`, {
      refreshToken: token,
    })

    if (apiResponse.data && apiResponse.data.data) {
      const { accessToken, refreshToken } = apiResponse.data.data
      await AuthStorage.setAccessToken(accessToken)
      await AuthStorage.setRefreshToken(refreshToken)
    }

    return {
      accessToken: apiResponse.data.data?.accessToken || null,
    }
  } catch (apiError) {
    await AuthStorage.clearAuth()

    if (isAxiosError(apiError)) {
      if (apiError.response) {
        console.error('백엔드 API 응답 오류:', apiError.response.data)

        return { accessToken: null }
      }
    }
    console.error('백엔드 API 호출 오류:', apiError)
    return { accessToken: null }
  }
}
