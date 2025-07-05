import axios from 'axios'
import apiInstance, { defaultOptions } from '../libs/api'
import { AppleLoginRequestDto, KakaoLoginRequestDto, LoginsApi, RefreshApi } from '@data/user-api-axios/api'

class LoginService extends LoginsApi {
  constructor() {
    super(undefined, '', apiInstance)
  }

  async apple(body: AppleLoginRequestDto) {
    const { data } = await this.loginWithApple({
      appleLoginRequestDto: body,
    })
    return data
  }

  async kakao(body: KakaoLoginRequestDto) {
    const { data } = await this.loginWithKakao({
      kakaoLoginRequestDto: body,
    })
    return data
  }
}

export default new LoginService()
