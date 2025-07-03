import apiInstance from '../libs/api'
import { SignUpsApi } from '@data/user-api-axios/api'

class SignUpService extends SignUpsApi {
  constructor() {
    super(undefined, '', apiInstance)
  }

  async requestSignUp(body) {
    const { data } = await this.signUp({
      signUpRequestDto: body,
    })

    return data
  }
}

export default new SignUpService()
