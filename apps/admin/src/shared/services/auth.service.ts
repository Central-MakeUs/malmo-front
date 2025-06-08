import { AuthApi } from '@data/admin-api/apis/auth'
import { PostAuthReqDto } from '@data/admin-api/models/auth'
import apiInstance, { initApi } from '../libs/api'

class AuthService extends AuthApi {
  constructor() {
    super(undefined, '', apiInstance)
  }

  async getAuth() {
    try {
      const authApi = new AuthApi(undefined, '', initApi({ throwError: true }))
      const { data } = await authApi.authControllerGetAuth()
      return { data }
    } catch (e: any) {
      throw e
    }
  }

  async login(options: { name: string; password: string }) {
    const { data } = await this.authControllerPostAuth({
      ...options,
      remember: true,
    })
    return data
  }
}

export default new AuthService()
