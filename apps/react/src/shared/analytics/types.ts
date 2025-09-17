import type { ButtonName, Category, PageName } from './constants'

// Re-export types from constants
export type { ButtonName, Category, PageName } from './constants'

// Amplitude 글로벌 타입
declare global {
  interface Window {
    amplitude: {
      track: (eventName: string, eventProperties?: Record<string, any>) => void
      identify: (userId: string, userProperties?: Record<string, any>) => void
      setUserId: (userId: string | null) => void
      setUserProperties: (userProperties: Record<string, any>) => void
      reset: () => void
      getSessionId: () => number | undefined
      getUserId: () => string | undefined
      getDeviceId: () => string | undefined
    }
  }
}

// 이벤트 타입
export type EventType = 'page_view' | 'button_click' | 'error_occurred'

// 페이지뷰 이벤트 속성
export interface PageViewProperties {
  page_name: PageName
  category: Category
  page_path: string
  referrer?: string
  timestamp?: string
}

// 버튼 클릭 이벤트 속성
export interface ButtonClickProperties {
  button_name: ButtonName
  category: Category
  page_name: PageName
  position?: 'header' | 'main' | 'footer' | 'modal' | 'sheet' | 'fab'
  timestamp?: string
}

// 에러 이벤트 속성
export interface ErrorProperties {
  error_type: 'api_fail' | 'validation' | 'timeout' | 'network' | 'unknown'
  error_message: string
  page_name: PageName
  category: Category
  timestamp?: string
}

// 사용자 속성
export interface UserProperties {
  user_id?: string
  nickname?: string
  couple_status?: 'single' | 'connected' | 'pending'
  partner_id?: string
  partner_nickname?: string
  anniversary_date?: string
  attachment_type?: string
  onboarding_completed?: boolean
  signup_date?: string
  last_active?: string
}
