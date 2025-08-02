import apiInstance from '../libs/api'
import { SignUpsApi } from '@data/user-api-axios/api'

class SignUpService extends SignUpsApi {
  constructor() {
    super(undefined, '', apiInstance)
  }

  // === Mutation Options ===
  signUpMutation() {
    return {
      mutationFn: async (body: any) => {
        const { data } = await this.signUp({
          signUpRequestDto: body,
        })
        return data
      },
    }
  }
}

export default new SignUpService()
