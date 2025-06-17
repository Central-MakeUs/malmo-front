import { AuthApi } from '@data/user-api-axios/api'
import axios from 'axios'
import apiInstance, { defaultOptions } from '../libs/api'
import { LoginFormType } from '@/features/auth/model'

class AuthService extends AuthApi {
  constructor() {
    super(undefined, '', apiInstance)
  }

  async getAuth() {
    try {
      const authApi = new AuthApi(undefined, '', axios.create(defaultOptions))
      const { data } = await authApi.authControllerGetAuth()
      return { data }
    } catch (e: any) {
      throw e
    }
  }

  async signIn({ accountId, password }: LoginFormType) {
    const { data } = await this.authControllerPostAuth({
      postAuthReqDto: {
        accountId,
        password,
      },
    })
    return data
  }
}

export default new AuthService()
