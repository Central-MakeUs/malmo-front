import { SocialLoginResult } from '@bridge/types'
import axios from 'axios'
import * as AppleAuthentication from 'expo-apple-authentication'
import { AuthStorage } from '../lib/auth-storage'

// 애플 로그인을 수행하는 함수
export async function appleLogin(): Promise<SocialLoginResult> {
  try {
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    })

    // ex: credential.user, credential.email, credential.fullName, credential.identityToken, credential.authorizationCode
    console.log(credential)

    try {
      const apiResponse = await axios.post(`${process.env.EXPO_PUBLIC_API_BASE_URL}/login/apple`, {
        accessToken: credential.authorizationCode,
        idToken: credential.identityToken,
      })

      if (apiResponse.data && apiResponse.data.data) {
        const { accessToken, refreshToken } = apiResponse.data.data

        await AuthStorage.setAccessToken(accessToken)
        await AuthStorage.setRefreshToken(refreshToken)
      }

      return {
        success: true,
        message: '로그인 성공',
      }
    } catch (apiError) {
      console.error('백엔드 API 호출 오류:', apiError)
      return {
        success: false,
        message: `백엔드 API 호출 중 오류가 발생했습니다: ${apiError instanceof Error ? apiError.message : String(apiError)}`,
      }
    }
  } catch (error) {
    console.error('애플 로그인 오류:', error)
    return {
      success: false,
      message: `애플 로그인 중 오류가 발생했습니다: ${error instanceof Error ? error.message : String(error)}`,
    }
  }
}
