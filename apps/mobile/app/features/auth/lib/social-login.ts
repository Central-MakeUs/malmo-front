import { SocialLoginResult, SocialLoginOptions } from '@bridge/types'
import { authClient } from './auth-client'
import { formatAxiosError, formatUnknownError, logAxiosError } from './error-utils'
import { persistAuthSession } from './persist-auth-session'

export interface SocialLoginRequest {
  path: string
  payload: Record<string, unknown>
  fetchProfile?: boolean
}

export interface SocialLoginProvider {
  authorize(): Promise<SocialLoginRequest>
}

export async function processSocialLogin(
  provider: SocialLoginProvider,
  options?: SocialLoginOptions
): Promise<SocialLoginResult> {
  try {
    const { path, payload, fetchProfile } = await provider.authorize()

    const requestPayload: Record<string, unknown> = {
      ...payload,
    }

    if (options?.deviceId != null) {
      requestPayload.deviceId = options.deviceId
    }

    try {
      const response = await authClient.post(path, requestPayload)
      const tokens = response.data?.data

      if (!tokens?.accessToken || !tokens?.refreshToken) {
        console.error('로그인 응답에 토큰이 없습니다:', response.data)
        return {
          success: false,
          message: '로그인 토큰을 받지 못했습니다.',
        }
      }

      await persistAuthSession(
        {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        },
        { fetchProfile }
      )

      return {
        success: true,
        message: '로그인 성공',
      }
    } catch (apiError) {
      logAxiosError(apiError, '로그인 API 호출')
      const message = formatAxiosError(apiError, '백엔드 API 호출 중 오류가 발생했습니다')

      return {
        success: false,
        message,
      }
    }
  } catch (authorizeError) {
    console.error('소셜 로그인 인증 오류:', authorizeError)
    return {
      success: false,
      message: formatUnknownError(authorizeError, '소셜 로그인 중 오류가 발생했습니다'),
    }
  }
}
