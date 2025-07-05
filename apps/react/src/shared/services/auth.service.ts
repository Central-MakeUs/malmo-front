// import axios from 'axios'
// import apiInstance, { defaultOptions } from '../libs/api'
// import { LoginFormType } from '@/features/auth/model'
// import { LoginsApi, RefreshApi } from '@data/user-api-axios/api'

// class AuthService extends RefreshApi {
//   constructor() {
//     super(undefined, '', apiInstance)
//   }

//   async getAuth() {
//     try {
//       const authApi = new RefreshApi(undefined, '', axios.create(defaultOptions))
//       const { data } = await authApi.authControllerGetAuth()
//       return { data }
//     } catch (e: any) {
//       throw e
//     }
//   }

//   async signIn({ accountId, password }: LoginFormType) {
//     const { data } = await this.authControllerPostAuth({
//       postAuthReqDto: {
//         accountId,
//         password,
//       },
//     })
//     return data
//   }
// }

// export default new AuthService()
