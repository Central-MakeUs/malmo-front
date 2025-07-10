import * as SecureStore from 'expo-secure-store'

export class AuthStorage {
  private static readonly ACCESS_TOKEN_KEY = 'auth_access_token'
  private static readonly REFRESH_TOKEN_KEY = 'auth_refresh_token'
  private static readonly USER_INFO_KEY = 'auth_user_info'

  // 액세스 토큰 저장
  static async setAccessToken(token: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(this.ACCESS_TOKEN_KEY, token)
    } catch (error) {
      console.error('액세스 토큰 저장 중 오류 발생:', error)
      throw error
    }
  }

  // 액세스 토큰 조회
  static async getAccessToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(this.ACCESS_TOKEN_KEY)
    } catch (error) {
      console.error('액세스 토큰 조회 중 오류 발생:', error)
      return null
    }
  }

  // 리프레시 토큰 저장
  static async setRefreshToken(token: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(this.REFRESH_TOKEN_KEY, token)
    } catch (error) {
      console.error('리프레시 토큰 저장 중 오류 발생:', error)
      throw error
    }
  }

  // 리프레시 토큰 조회
  static async getRefreshToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(this.REFRESH_TOKEN_KEY)
    } catch (error) {
      console.error('리프레시 토큰 조회 중 오류 발생:', error)
      return null
    }
  }

  // 사용자 정보 저장
  static async setUserInfo(userInfo: any): Promise<void> {
    try {
      await SecureStore.setItemAsync(this.USER_INFO_KEY, JSON.stringify(userInfo))
    } catch (error) {
      console.error('사용자 정보 저장 중 오류 발생:', error)
      throw error
    }
  }

  // 사용자 정보 조회
  static async getUserInfo<T>(): Promise<T | null> {
    try {
      const userInfo = await SecureStore.getItemAsync(this.USER_INFO_KEY)
      return userInfo ? JSON.parse(userInfo) : null
    } catch (error) {
      console.error('사용자 정보 조회 중 오류 발생:', error)
      return null
    }
  }

  // 인증 여부 확인
  static async isAuthenticated(): Promise<boolean> {
    const token = await this.getAccessToken()
    return !!token
  }

  // 모든 인증 정보 삭제
  static async clearAuth(): Promise<void> {
    try {
      await Promise.all([
        SecureStore.deleteItemAsync(this.ACCESS_TOKEN_KEY),
        SecureStore.deleteItemAsync(this.REFRESH_TOKEN_KEY),
        SecureStore.deleteItemAsync(this.USER_INFO_KEY),
      ])
    } catch (error) {
      console.error('인증 정보 삭제 중 오류 발생:', error)
      throw error
    }
  }
}
