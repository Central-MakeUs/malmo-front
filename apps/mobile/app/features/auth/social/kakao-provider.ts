import * as KakaoUser from '@react-native-kakao/user'
import { SocialLoginProvider } from '../lib/social-login'

export const kakaoProvider: SocialLoginProvider = {
  async authorize() {
    const token = await KakaoUser.login()

    if (!token || !token.accessToken) {
      throw new Error('카카오 로그인 토큰을 받지 못했습니다.')
    }

    return {
      path: '/login/kakao',
      payload: {
        accessToken: token.accessToken,
        idToken: token.idToken,
      },
    }
  },
}
