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

  if (fetchProfile) {
    try {
      const memberResponse = await authClient.get('/members', {
        headers: { Authorization: `Bearer ${tokens.accessToken}` },
      })

      const email = memberResponse.data?.data?.email ?? null

      if (!email) {
        throw new Error('프로필 조회 성공했지만 이메일이 없습니다.')
      }

      await AuthStorage.setCurrentUserEmail(email)
    } catch (error) {
      logAxiosError(error, '회원 정보 조회')
      throw error instanceof Error ? error : new Error('회원 정보 조회 실패')
    }
  }

  await AuthStorage.setAccessToken(tokens.accessToken)
  await AuthStorage.setRefreshToken(tokens.refreshToken)
}
