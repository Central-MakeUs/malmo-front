import { authClient } from './auth-client'
import { logAxiosError } from './error-utils'
import { AuthStorage } from './auth-storage'

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

interface PersistAuthSessionOptions {
  fetchProfile?: boolean
}

export async function persistAuthSession(tokens: AuthTokens, options?: PersistAuthSessionOptions): Promise<void> {
  const { fetchProfile = true } = options ?? {}

  await AuthStorage.setAccessToken(tokens.accessToken)
  await AuthStorage.setRefreshToken(tokens.refreshToken)

  if (!fetchProfile) {
    return
  }

  try {
    const memberResponse = await authClient.get('/members', {
      headers: { Authorization: `Bearer ${tokens.accessToken}` },
    })

    const email = memberResponse.data?.data?.email ?? null
    await AuthStorage.setCurrentUserEmail(email)
  } catch (error) {
    logAxiosError(error, '회원 정보 조회')
  }
}
