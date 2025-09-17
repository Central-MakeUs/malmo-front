import type { ButtonName, Category, PageName } from './constants'

// Re-export for convenience
export type { ButtonName, Category, PageName }

// Window.amplitude 타입 정의
declare global {
  interface Window {
    amplitude: {
      track: (eventName: string, eventProperties?: Record<string, any>) => void
      identify: (userId: string, userProperties?: Record<string, any>) => void
      setUserId: (userId: string | null) => void
      setUserProperties: (userProperties: Record<string, any>) => void
      setGroup: (groupType: string, groupName: string | string[]) => void
      groupIdentify: (groupType: string, groupName: string | string[], groupProperties: Record<string, any>) => void
      revenue: (revenue: any) => void
      reset: () => void
      getSessionId: () => number | undefined
      getUserId: () => string | undefined
      getDeviceId: () => string | undefined
    }
  }
}

// 페이지뷰 이벤트 속성
export interface PageViewProperties {
  page_name: PageName
  category: Category
  page_path: string
  referrer: string
  timestamp?: string
}

// 버튼 클릭 이벤트 속성
export interface ButtonClickProperties {
  button_name: ButtonName
  category: Category
  page_name: PageName
  timestamp?: string
}

// 에러 이벤트 속성
export interface ErrorProperties {
  error_type:
    | 'api_error'
    | 'validation_error'
    | 'network_error'
    | 'unknown_error'
    | 'not_found'
    | 'forbidden'
    | 'timeout'
    | 'token_refresh_failed'
    | 'runtime_error'
  error_message: string
  page_name: PageName
  category: Category
  timestamp?: string
  stack_trace?: string
}

// 사용자 속성
export interface UserProperties {
  user_id?: string
  nickname?: string
  love_type_category?: string
  partner_connected?: boolean
  anniversary_date?: string
  onboarding_completed?: boolean
  created_at?: string
  [key: string]: any
}
