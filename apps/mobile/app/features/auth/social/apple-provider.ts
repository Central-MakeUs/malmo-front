import * as AppleAuthentication from 'expo-apple-authentication'
import { SocialLoginProvider } from '../lib/social-login'

export const appleProvider: SocialLoginProvider = {
  async authorize() {
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    })

    if (!credential.identityToken || !credential.authorizationCode) {
      throw new Error('애플 로그인 토큰을 가져오지 못했습니다.')
    }

    return {
      path: '/login/apple',
      payload: {
        idToken: credential.identityToken,
        authorizationCode: credential.authorizationCode,
      },
    }
  },
}
