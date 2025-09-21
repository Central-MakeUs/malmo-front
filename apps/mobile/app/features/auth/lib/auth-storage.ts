import * as SecureStore from 'expo-secure-store'

export class AuthStorage {
  private static readonly ACCESS_TOKEN_KEY = 'auth_access_token'
  private static readonly REFRESH_TOKEN_KEY = 'auth_refresh_token'
  private static readonly USER_INFO_KEY = 'auth_user_info'
  private static readonly CHAT_TUTORIAL_KEY = 'chat_tutorial_seen'
  private static readonly QUESTION_HELP_KEY = 'question_help'
  private static readonly INTRO_SEEN_KEY = 'intro_seen'
  private static readonly CURRENT_EMAIL_KEY = 'auth_current_email'

  // 이메일 정규화: 소문자 변환 및 앞뒤 공백 제거
  private static normalizeEmail(email: string): string {
    return email.trim().toLowerCase()
  }

  private static buildEmailKey(baseKey: string, email: string): string {
    const normalizedEmail = this.normalizeEmail(email)
    const encodeKeySegment = Array.from(normalizedEmail)
      .map((char) => char.charCodeAt(0).toString(16).padStart(2, '0'))
      .join('')

    return `${baseKey}_${encodeKeySegment}`
  }

  private static async resolveKey(baseKey: string): Promise<string> {
    const currentEmail = await this.getCurrentUserEmail()
    if (currentEmail) {
      return this.buildEmailKey(baseKey, currentEmail)
    }

    return baseKey
  }

  private static async setScopedItem(baseKey: string, value: string): Promise<void> {
    const key = await this.resolveKey(baseKey)
    await SecureStore.setItemAsync(key, value)

    if (key !== baseKey) {
      await SecureStore.deleteItemAsync(baseKey)
    }
  }

  private static async getScopedItem(baseKey: string): Promise<string | null> {
    const key = await this.resolveKey(baseKey)
    const value = await SecureStore.getItemAsync(key)

    if (value !== null) {
      return value
    }

    if (key !== baseKey) {
      return await SecureStore.getItemAsync(baseKey)
    }

    return null
  }

  private static async deleteScopedItem(baseKey: string): Promise<void> {
    const key = await this.resolveKey(baseKey)

    await SecureStore.deleteItemAsync(key)

    if (key !== baseKey) {
      await SecureStore.deleteItemAsync(baseKey)
    }
  }

  // 액세스 토큰 저장
  static async setAccessToken(token: string): Promise<void> {
    try {
      await this.setScopedItem(this.ACCESS_TOKEN_KEY, token)
    } catch (error) {
      console.error('액세스 토큰 저장 중 오류 발생:', error)
      throw error
    }
  }

  // 액세스 토큰 조회
  static async getAccessToken(): Promise<string | null> {
    try {
      return await this.getScopedItem(this.ACCESS_TOKEN_KEY)
    } catch (error) {
      console.error('액세스 토큰 조회 중 오류 발생:', error)
      return null
    }
  }

  // 리프레시 토큰 저장
  static async setRefreshToken(token: string): Promise<void> {
    try {
      await this.setScopedItem(this.REFRESH_TOKEN_KEY, token)
    } catch (error) {
      console.error('리프레시 토큰 저장 중 오류 발생:', error)
      throw error
    }
  }

  // 리프레시 토큰 조회
  static async getRefreshToken(): Promise<string | null> {
    try {
      return await this.getScopedItem(this.REFRESH_TOKEN_KEY)
    } catch (error) {
      console.error('리프레시 토큰 조회 중 오류 발생:', error)
      return null
    }
  }

  // 사용자 정보 저장
  static async setUserInfo(userInfo: any): Promise<void> {
    try {
      await this.setScopedItem(this.USER_INFO_KEY, JSON.stringify(userInfo))
    } catch (error) {
      console.error('사용자 정보 저장 중 오류 발생:', error)
      throw error
    }
  }

  // 사용자 정보 조회
  static async getUserInfo<T>(): Promise<T | null> {
    try {
      const userInfo = await this.getScopedItem(this.USER_INFO_KEY)
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
        this.deleteScopedItem(this.ACCESS_TOKEN_KEY),
        this.deleteScopedItem(this.REFRESH_TOKEN_KEY),
        this.deleteScopedItem(this.USER_INFO_KEY),
        this.deleteScopedItem(this.CHAT_TUTORIAL_KEY),
        this.deleteScopedItem(this.QUESTION_HELP_KEY),
        this.deleteScopedItem(this.INTRO_SEEN_KEY),
        SecureStore.deleteItemAsync(this.CURRENT_EMAIL_KEY),
      ])
    } catch (error) {
      console.error('인증 정보 삭제 중 오류 발생:', error)
      throw error
    }
  }

  static async setChatTutorialSeen(seen: boolean): Promise<void> {
    try {
      await this.setScopedItem(this.CHAT_TUTORIAL_KEY, JSON.stringify(seen))
    } catch (error) {
      console.error('채팅 튜토리얼 상태 저장 중 오류 발생:', error)
      throw error
    }
  }

  static async getChatTutorialSeen(): Promise<boolean> {
    try {
      const seen = await this.getScopedItem(this.CHAT_TUTORIAL_KEY)
      return seen ? JSON.parse(seen) : false
    } catch (error) {
      console.error('채팅 튜토리얼 상태 조회 중 오류 발생:', error)
      return false
    }
  }

  static async getQuestionHelp(): Promise<boolean> {
    try {
      const help = await this.getScopedItem(this.QUESTION_HELP_KEY)
      console.log('Question help status:', help)
      return help ? JSON.parse(help) : true
    } catch (error) {
      console.error('질문 도움말 상태 조회 중 오류 발생:', error)
      return true
    }
  }

  static async setQuestionHelp(help: boolean): Promise<void> {
    try {
      await this.setScopedItem(this.QUESTION_HELP_KEY, JSON.stringify(help))
    } catch (error) {
      console.error('질문 도움말 상태 저장 중 오류 발생:', error)
      throw error
    }
  }

  static async getIntroSeen(): Promise<boolean> {
    try {
      const seen = await this.getScopedItem(this.INTRO_SEEN_KEY)
      return seen ? JSON.parse(seen) : false
    } catch (error) {
      console.error('소개 페이지 확인 상태 조회 중 오류 발생:', error)
      return false
    }
  }

  static async setIntroSeen(): Promise<void> {
    try {
      await this.setScopedItem(this.INTRO_SEEN_KEY, JSON.stringify(true))
    } catch (error) {
      console.error('소개 페이지 확인 상태 저장 중 오류 발생:', error)
      throw error
    }
  }

  static async setCurrentUserEmail(email: string | null): Promise<void> {
    try {
      if (!email?.trim()) {
        await SecureStore.deleteItemAsync(this.CURRENT_EMAIL_KEY)
        return
      }

      const normalizedEmail = this.normalizeEmail(email)
      await SecureStore.setItemAsync(this.CURRENT_EMAIL_KEY, normalizedEmail)
    } catch (error) {
      console.error('현재 사용자 이메일 저장 중 오류 발생:', error)
      throw error
    }
  }

  static async getCurrentUserEmail(): Promise<string | null> {
    try {
      const email = await SecureStore.getItemAsync(this.CURRENT_EMAIL_KEY)
      return email || null
    } catch (error) {
      console.error('현재 사용자 이메일 조회 중 오류 발생:', error)
      return null
    }
  }
}
