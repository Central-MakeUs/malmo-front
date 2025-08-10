import { AppleLoginRequestDto, KakaoLoginRequestDto, LoginsApi } from '@data/user-api-axios/api'

import apiInstance from '../lib/api'
import { toast } from '../ui/toast'

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
        toast.error('Apple 로그인 중 오류가 발생했습니다')
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
        toast.error('카카오 로그인 중 오류가 발생했습니다')
      },
    }
  }
}

export default new LoginService()
