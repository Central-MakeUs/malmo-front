import * as KakaoUser from '@react-native-kakao/user'
import axios from 'axios'
import { SocialLoginResult } from '@bridge/types'
import { AuthStorage } from '../lib/auth-storage'

export async function kakaoLogin(): Promise<SocialLoginResult> {
  try {
    const token = await KakaoUser.login()

    if (!token) {
      throw new Error('로그인 토큰을 받지 못했습니다.')
    }

    try {
      const apiResponse = await axios.post(`${process.env.EXPO_PUBLIC_API_BASE_URL}/login/kakao`, {
        accessToken: token.accessToken,
        idToken: token.idToken,
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
  } catch (kakaoError) {
    console.error('카카오 로그인 오류:', kakaoError)
    return {
      success: false,
      message: `카카오 로그인 중 오류가 발생했습니다: ${kakaoError instanceof Error ? kakaoError.message : String(kakaoError)}`,
    }
  }
}
