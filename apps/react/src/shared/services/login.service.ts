import apiInstance from '../libs/api'
import { AppleLoginRequestDto, KakaoLoginRequestDto, LoginsApi } from '@data/user-api-axios/api'

class LoginService extends LoginsApi {
  constructor() {
    super(undefined, '', apiInstance)
  }

  // === Mutation Options ===
  appleLoginMutation() {
    return {
      mutationFn: async (body: AppleLoginRequestDto) => {
        const { data } = await this.loginWithApple({
          appleLoginRequestDto: body,
        })
        return data
      },
      onError: () => {
        // TODO: 토스트 메시지로 에러 처리
      },
    }
  }

  kakaoLoginMutation() {
    return {
      mutationFn: async (body: KakaoLoginRequestDto) => {
        const { data } = await this.loginWithKakao({
          kakaoLoginRequestDto: body,
        })
        return data
      },
      onError: () => {
        // TODO: 토스트 메시지로 에러 처리
      },
    }
  }
}

export default new LoginService()
