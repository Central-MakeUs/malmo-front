import { CATEGORIES, PAGE_NAMES, type ButtonName, type Category } from './constants'

import type { ButtonClickProperties, ErrorProperties, PageName, PageViewProperties, UserProperties } from './types'

// 현재 페이지 정보를 저장
let currentPageName: PageName = PAGE_NAMES.HOME
let currentCategory: Category = CATEGORIES.MAIN

// Amplitude 서비스 클래스
class AmplitudeService {
  private isInitialized = false
  private isProduction = import.meta.env.PROD

  constructor() {
    // 프로덕션이고 Amplitude가 로드된 경우에만 초기화
    if (typeof window !== 'undefined' && window.amplitude) {
      this.isInitialized = true
    }
  }

  // 페이지뷰 추적
  trackPageView(properties: PageViewProperties): void {
    // 개발 환경에서는 로그만 출력
    if (!this.isProduction) {
      console.log('[Page View - DEV]', properties)
      return
    }

    if (!this.isInitialized || !window.amplitude) {
      console.warn('Amplitude not initialized')
      return
    }

    // 현재 페이지 정보 저장
    currentPageName = properties.page_name
    currentCategory = properties.category

    const eventProperties = {
      ...properties,
      timestamp: new Date().toISOString(),
    }

    window.amplitude.track('page_view', eventProperties)
  }

  // 버튼 클릭 추적
  trackButtonClick(properties: Omit<ButtonClickProperties, 'page_name'>): void {
    // 개발 환경에서는 로그만 출력
    if (!this.isProduction) {
      const eventProperties: ButtonClickProperties = {
        ...properties,
        page_name: currentPageName,
        timestamp: new Date().toISOString(),
      }
      console.log('[Button Click - DEV]', eventProperties)
      return
    }

    if (!this.isInitialized || !window.amplitude) {
      console.warn('Amplitude not initialized')
      return
    }

    const eventProperties: ButtonClickProperties = {
      ...properties,
      page_name: currentPageName,
      timestamp: new Date().toISOString(),
    }

    window.amplitude.track('button_click', eventProperties)
  }

  // 에러 추적
  trackError(properties: Omit<ErrorProperties, 'page_name' | 'category'>): void {
    // 개발 환경에서는 로그만 출력
    if (!this.isProduction) {
      const eventProperties: ErrorProperties = {
        ...properties,
        page_name: currentPageName,
        category: currentCategory,
        timestamp: new Date().toISOString(),
      }
      console.error('[Error - DEV]', eventProperties)
      return
    }

    if (!this.isInitialized || !window.amplitude) {
      console.warn('Amplitude not initialized')
      return
    }

    const eventProperties: ErrorProperties = {
      ...properties,
      page_name: currentPageName,
      category: currentCategory,
      timestamp: new Date().toISOString(),
    }

    window.amplitude.track('error_occurred', eventProperties)
  }

  // 사용자 식별
  identify(userId: string, properties?: UserProperties): void {
    // 개발 환경에서는 로그만 출력
    if (!this.isProduction) {
      console.log('[Identify - DEV]', userId, properties)
      return
    }

    if (!this.isInitialized || !window.amplitude) {
      console.warn('Amplitude not initialized')
      return
    }

    window.amplitude.identify(userId, properties)
  }

  // 사용자 속성 업데이트
  updateUserProperties(properties: UserProperties): void {
    // 개발 환경에서는 로그만 출력
    if (!this.isProduction) {
      console.log('[User Properties - DEV]', properties)
      return
    }

    if (!this.isInitialized || !window.amplitude) {
      console.warn('Amplitude not initialized')
      return
    }

    window.amplitude.setUserProperties(properties)
  }

  // 사용자 리셋 (로그아웃)
  reset(): void {
    // 개발 환경에서는 로그만 출력
    if (!this.isProduction) {
      console.log('[Reset - DEV]')
      currentPageName = PAGE_NAMES.HOME
      currentCategory = CATEGORIES.MAIN
      return
    }

    if (!this.isInitialized || !window.amplitude) {
      console.warn('Amplitude not initialized')
      return
    }

    window.amplitude.reset()
    currentPageName = PAGE_NAMES.HOME
    currentCategory = CATEGORIES.MAIN
  }

  // 현재 페이지 정보 가져오기
  getCurrentPageInfo() {
    return {
      pageName: currentPageName,
      category: currentCategory,
    }
  }
}

// 싱글톤 인스턴스
export const amplitude = new AmplitudeService()

// 헬퍼 함수들
export function trackPageView(pageName: PageName, category: Category, path: string) {
  amplitude.trackPageView({
    page_name: pageName,
    category,
    page_path: path,
    referrer: document.referrer,
  })
}

export function trackButtonClick(buttonName: ButtonName | string, category: Category) {
  amplitude.trackButtonClick({
    button_name: buttonName as ButtonName,
    category,
  })
}

export function trackError(errorType: ErrorProperties['error_type'], message: string) {
  amplitude.trackError({
    error_type: errorType,
    error_message: message,
  })
}
