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
    }
  }
}

export default new LoginService()
