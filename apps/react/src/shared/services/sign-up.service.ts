import apiInstance from '../libs/api'
import { SignUpsApi, SignUpRequestDto } from '@data/user-api-axios/api'
import { toast } from '../components/toast'

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
        toast.error('회원가입 중 오류가 발생했습니다')
      },
    }
  }
}

export default new SignUpService()
