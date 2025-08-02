import apiInstance from '../libs/api'
import { SignUpsApi, SignUpRequestDto } from '@data/user-api-axios/api'

class SignUpService extends SignUpsApi {
  constructor() {
    super(undefined, '', apiInstance)
  }

  // === Mutation Options ===
  signUpMutation() {
    return {
      mutationFn: async (body: SignUpRequestDto) => {
        const { data } = await this.signUp({
          signUpRequestDto: body,
        })
        return data
      },
      onError: () => {
        // TODO: 토스트 메시지로 에러 처리
      },
    }
  }
}

export default new SignUpService()
