import * as SecureStore from 'expo-secure-store'

export class AuthStorage {
  private static readonly ACCESS_TOKEN_KEY = 'auth_access_token'
  private static readonly REFRESH_TOKEN_KEY = 'auth_refresh_token'
  private static readonly USER_INFO_KEY = 'auth_user_info'
  private static readonly CHAT_TUTORIAL_KEY = 'chat_tutorial_seen'
  private static readonly QUESTION_HELP_KEY = 'question_help'
  private static readonly INTRO_SEEN_KEY = 'intro_seen'
  private static readonly CURRENT_EMAIL_KEY = 'auth_current_email'

  private static normalizeEmail(email: string): string {
    return email.trim().toLowerCase()
  }

  private static encodeForKeySegment(value: string): string {
    return Array.from(value)
      .map((char) => char.charCodeAt(0).toString(16).padStart(2, '0'))
      .join('')
  }

  private static buildEmailKey(baseKey: string, email: string): string {
    const normalizedEmail = this.normalizeEmail(email)
    return `${baseKey}_${this.encodeForKeySegment(normalizedEmail)}`
  }

  private static async resolveKey(baseKey: string, email?: string | null): Promise<string> {
    if (typeof email === 'string' && email.trim().length > 0) {
      return this.buildEmailKey(baseKey, email)
    }

    const currentEmail = await this.getCurrentUserEmail()
    if (currentEmail) {
      return this.buildEmailKey(baseKey, currentEmail)
    }

    return baseKey
  }

  private static async migrateKeyToEmailScope(baseKey: string, email: string): Promise<void> {
    try {
      const baseValue = await SecureStore.getItemAsync(baseKey)
      if (!baseValue) {
        return
      }

      const scopedKey = this.buildEmailKey(baseKey, email)
      const scopedValue = await SecureStore.getItemAsync(scopedKey)

      if (!scopedValue) {
        await SecureStore.setItemAsync(scopedKey, baseValue)
      }

      await SecureStore.deleteItemAsync(baseKey)
    } catch (error) {
      console.error(`키 마이그레이션 중 오류 발생 (${baseKey}):`, error)
    }
  }

  private static async migrateGlobalValuesToEmail(email: string): Promise<void> {
    await Promise.all([
      this.migrateKeyToEmailScope(this.ACCESS_TOKEN_KEY, email),
      this.migrateKeyToEmailScope(this.REFRESH_TOKEN_KEY, email),
      this.migrateKeyToEmailScope(this.USER_INFO_KEY, email),
      this.migrateKeyToEmailScope(this.CHAT_TUTORIAL_KEY, email),
      this.migrateKeyToEmailScope(this.QUESTION_HELP_KEY, email),
      this.migrateKeyToEmailScope(this.INTRO_SEEN_KEY, email),
    ])
  }

  // 액세스 토큰 저장
  static async setAccessToken(token: string): Promise<void> {
    try {
      const key = await this.resolveKey(this.ACCESS_TOKEN_KEY)
      await SecureStore.setItemAsync(key, token)
    } catch (error) {
      console.error('액세스 토큰 저장 중 오류 발생:', error)
      throw error
    }
  }

  // 액세스 토큰 조회
  static async getAccessToken(): Promise<string | null> {
    try {
      const key = await this.resolveKey(this.ACCESS_TOKEN_KEY)
      return await SecureStore.getItemAsync(key)
    } catch (error) {
      console.error('액세스 토큰 조회 중 오류 발생:', error)
      return null
    }
  }

  // 리프레시 토큰 저장
  static async setRefreshToken(token: string): Promise<void> {
    try {
      const key = await this.resolveKey(this.REFRESH_TOKEN_KEY)
      await SecureStore.setItemAsync(key, token)
    } catch (error) {
      console.error('리프레시 토큰 저장 중 오류 발생:', error)
      throw error
    }
  }

  // 리프레시 토큰 조회
  static async getRefreshToken(): Promise<string | null> {
    try {
      const key = await this.resolveKey(this.REFRESH_TOKEN_KEY)
      return await SecureStore.getItemAsync(key)
    } catch (error) {
      console.error('리프레시 토큰 조회 중 오류 발생:', error)
      return null
    }
  }

  // 사용자 정보 저장
  static async setUserInfo(userInfo: any): Promise<void> {
    try {
      const key = await this.resolveKey(this.USER_INFO_KEY)
      await SecureStore.setItemAsync(key, JSON.stringify(userInfo))
    } catch (error) {
      console.error('사용자 정보 저장 중 오류 발생:', error)
      throw error
    }
  }

  // 사용자 정보 조회
  static async getUserInfo<T>(): Promise<T | null> {
    try {
      const key = await this.resolveKey(this.USER_INFO_KEY)
      const userInfo = await SecureStore.getItemAsync(key)
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
      const [accessTokenKey, refreshTokenKey, userInfoKey] = await Promise.all([
        this.resolveKey(this.ACCESS_TOKEN_KEY),
        this.resolveKey(this.REFRESH_TOKEN_KEY),
        this.resolveKey(this.USER_INFO_KEY),
      ])

      await Promise.all([
        SecureStore.deleteItemAsync(accessTokenKey),
        SecureStore.deleteItemAsync(refreshTokenKey),
        SecureStore.deleteItemAsync(userInfoKey),
      ])
    } catch (error) {
      console.error('인증 정보 삭제 중 오류 발생:', error)
      throw error
    }
  }

  static async setChatTutorialSeen(seen: boolean): Promise<void> {
    try {
      const key = await this.resolveKey(this.CHAT_TUTORIAL_KEY)
      await SecureStore.setItemAsync(key, JSON.stringify(seen))
    } catch (error) {
      console.error('채팅 튜토리얼 상태 저장 중 오류 발생:', error)
      throw error
    }
  }

  static async getChatTutorialSeen(): Promise<boolean> {
    try {
      const key = await this.resolveKey(this.CHAT_TUTORIAL_KEY)
      const seen = await SecureStore.getItemAsync(key)
      return seen ? JSON.parse(seen) : false
    } catch (error) {
      console.error('채팅 튜토리얼 상태 조회 중 오류 발생:', error)
      return false
    }
  }

  static async getQuestionHelp(): Promise<boolean> {
    try {
      const key = await this.resolveKey(this.QUESTION_HELP_KEY)
      const help = await SecureStore.getItemAsync(key)
      console.log('Question help status:', help)
      return help ? JSON.parse(help) : true
    } catch (error) {
      console.error('질문 도움말 상태 조회 중 오류 발생:', error)
      return true
    }
  }

  static async setQuestionHelp(help: boolean): Promise<void> {
    try {
      const key = await this.resolveKey(this.QUESTION_HELP_KEY)
      await SecureStore.setItemAsync(key, JSON.stringify(help))
    } catch (error) {
      console.error('질문 도움말 상태 저장 중 오류 발생:', error)
      throw error
    }
  }

  static async getIntroSeen(): Promise<boolean> {
    try {
      const key = await this.resolveKey(this.INTRO_SEEN_KEY)
      const seen = await SecureStore.getItemAsync(key)
      return seen ? JSON.parse(seen) : false
    } catch (error) {
      console.error('소개 페이지 확인 상태 조회 중 오류 발생:', error)
      return false
    }
  }

  static async setIntroSeen(): Promise<void> {
    try {
      const key = await this.resolveKey(this.INTRO_SEEN_KEY)
      await SecureStore.setItemAsync(key, JSON.stringify(true))
    } catch (error) {
      console.error('소개 페이지 확인 상태 저장 중 오류 발생:', error)
      throw error
    }
  }

  static async setCurrentUserEmail(email: string | null): Promise<void> {
    try {
      if (!email || email.trim().length === 0) {
        await SecureStore.deleteItemAsync(this.CURRENT_EMAIL_KEY)
        return
      }

      const normalizedEmail = this.normalizeEmail(email)
      await SecureStore.setItemAsync(this.CURRENT_EMAIL_KEY, normalizedEmail)
      await this.migrateGlobalValuesToEmail(normalizedEmail)
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
