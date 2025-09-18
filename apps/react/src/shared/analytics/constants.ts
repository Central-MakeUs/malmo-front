// 카테고리 상수
export const CATEGORIES = {
  MAIN: 'main',
  AUTH: 'auth',
  ONBOARDING: 'onboarding',
  CHAT: 'chat',
  ATTACHMENT: 'attachment',
  QUESTION: 'question',
  PROFILE: 'profile',
} as const

// 페이지명 상수
export const PAGE_NAMES = {
  // Main
  HOME: 'home',
  PARTNER_STATUS: 'partner_status',
  HISTORY_MAIN: 'history_main',
  HISTORY_DELETE: 'history_delete',

  // Auth
  INTRO: 'intro',
  LOGIN: 'login',

  // Onboarding
  ONBOARDING_TERMS: 'onboarding_terms',
  ONBOARDING_NICKNAME: 'onboarding_nickname',
  ONBOARDING_ANNIVERSARY: 'onboarding_anniversary',
  ONBOARDING_MY_CODE: 'onboarding_my_code',
  ONBOARDING_PARTNER_CODE: 'onboarding_partner_code',
  ONBOARDING_COMPLETE: 'onboarding_complete',

  // Chat
  CHAT_MAIN: 'chat_main',
  CHAT_LOADING: 'chat_loading',
  CHAT_RESULT: 'chat_result',

  // Attachment
  ATTACHMENT_INTRO: 'attachment_intro',
  ATTACHMENT_QUESTION: 'attachment_question',
  ATTACHMENT_RESULT_MY: 'attachment_result_my',
  ATTACHMENT_RESULT_PARTNER: 'attachment_result_partner',

  // Question
  QUESTION_CALENDAR: 'question_calendar',
  QUESTION_WRITE: 'question_write',
  QUESTION_ANSWER: 'question_answer',

  // Profile
  MYPAGE_MAIN: 'mypage_main',
  MYPAGE_PROFILE: 'mypage_profile',
  MYPAGE_COUPLE: 'mypage_couple',
  MYPAGE_SETTINGS: 'mypage_settings',
  TERMS_PRIVACY: 'terms_privacy',
} as const

// 버튼명 상수
export const BUTTON_NAMES = {
  // Main
  START_NEW_CHAT: 'start_new_chat',
  CONTINUE_CHAT: 'continue_chat',
  GO_ATTACHMENT_TEST: 'go_attachment_test',
  OPEN_TODAY_QUESTION: 'open_today_question',
  VIEW_ATTACHMENT_CARD: 'view_attachment_card',
  NAV_HOME: 'nav_home',
  NAV_HISTORY: 'nav_history',
  NAV_QUESTION: 'nav_question',
  NAV_PROFILE: 'nav_profile',

  // Auth
  NEXT_INTRO: 'next_intro',
  SKIP_INTRO: 'skip_intro',
  START_INTRO: 'start_intro',
  PREV_INTRO: 'prev_intro',
  SELECT_INTRO_DOT: 'select_intro_dot',
  LOGIN_KAKAO: 'login_kakao',
  LOGIN_APPLE: 'login_apple',
  GO_MYPAGE: 'go_mypage',

  // Onboarding
  BACK_TERMS: 'back_terms',
  AGREE_ALL: 'agree_all',
  AGREE_SERVICE: 'agree_service',
  AGREE_PRIVACY: 'agree_privacy',
  AGREE_MARKETING: 'agree_marketing',
  OPEN_TERMS_MODAL: 'open_terms_modal',
  CLOSE_TERMS_MODAL: 'close_terms_modal',
  NEXT_TERMS: 'next_terms',
  BACK_NICKNAME: 'back_nickname',
  INPUT_NICKNAME: 'input_nickname',
  NEXT_NICKNAME: 'next_nickname',
  BACK_ANNIVERSARY: 'back_anniversary',
  SELECT_YEAR: 'select_year',
  SELECT_MONTH: 'select_month',
  SELECT_DAY: 'select_day',
  NEXT_ANNIVERSARY: 'next_anniversary',
  BACK_MY_CODE: 'back_my_code',
  COPY_MY_CODE: 'copy_my_code',
  GO_PARTNER_CODE: 'go_partner_code',
  SKIP_PARTNER: 'skip_partner',
  BACK_PARTNER_CODE: 'back_partner_code',
  INPUT_PARTNER_CODE: 'input_partner_code',
  CONNECT_PARTNER: 'connect_partner',
  START_SERVICE: 'start_service',

  // Chat
  EXIT_CHAT: 'exit_chat',
  BACK_CHAT: 'back_chat',
  INPUT_MESSAGE: 'input_message',
  SEND_MESSAGE: 'send_message',
  RETRY_MESSAGE: 'retry_message',
  GO_MYPAGE_FROM_CHAT: 'go_mypage_from_chat',
  DELETE_HISTORY: 'delete_history',
  CLOSE_RESULT: 'close_result',
  BACK_RESULT: 'back_result',
  VIEW_CHAT: 'view_chat',
  GO_HOME_FROM_RESULT: 'go_home_from_result',

  // Attachment
  START_TEST: 'start_test',
  BACK_TEST: 'back_test',
  SELECT_OPTION_1: 'select_option_1',
  SELECT_OPTION_2: 'select_option_2',
  SELECT_OPTION_3: 'select_option_3',
  SELECT_OPTION_4: 'select_option_4',
  SELECT_OPTION_5: 'select_option_5',
  NEXT_QUESTION: 'next_question',
  COMPLETE_TEST: 'complete_test',
  CLOSE_GUIDE: 'close_guide',

  // Question
  PREV_CALENDAR: 'prev_calendar',
  NEXT_CALENDAR: 'next_calendar',
  SELECT_DATE: 'select_date',
  WRITE_ANSWER: 'write_answer',
  VIEW_ANSWER: 'view_answer',
  BACK_WRITE: 'back_write',
  INPUT_ANSWER: 'input_answer',
  SAVE_ANSWER: 'save_answer',
  EDIT_ANSWER: 'edit_answer',
  CLOSE_TOOLTIP: 'close_tooltip',

  // History
  DELETE_MODE: 'delete_mode',
  SEARCH_HISTORY: 'search_history',
  SELECT_HISTORY: 'select_history',
  OPEN_CHAT_FAB: 'open_chat_fab',
  BACK_DELETE: 'back_delete',
  SELECT_ITEM: 'select_item',
  DELETE_SELECTED: 'delete_selected',

  // Profile
  OPEN_PROFILE_EDIT: 'open_profile_edit',
  OPEN_COUPLE_MANAGE: 'open_couple_manage',
  OPEN_ACCOUNT_SETTINGS: 'open_account_settings',
  OPEN_TERMS_SERVICE: 'open_terms_service',
  OPEN_TERMS_PRIVACY: 'open_terms_privacy',
  BACK_PROFILE: 'back_profile',
  OPEN_NICKNAME_SHEET: 'open_nickname_sheet',
  OPEN_ANNIVERSARY_SHEET: 'open_anniversary_sheet',
  SAVE_NICKNAME: 'save_nickname',
  SAVE_ANNIVERSARY: 'save_anniversary',
  CLOSE_SHEET: 'close_sheet',
  COPY_INVITE_CODE: 'copy_invite_code',
  OPEN_PARTNER_SHEET: 'open_partner_sheet',
  DISCONNECT_COUPLE: 'disconnect_couple',
  CONFIRM_DISCONNECT: 'confirm_disconnect',
  LOGOUT: 'logout',
  CONFIRM_LOGOUT: 'confirm_logout',
  WITHDRAW: 'withdraw',
  CONFIRM_WITHDRAW: 'confirm_withdraw',
} as const

// 타입 추출
export type Category = (typeof CATEGORIES)[keyof typeof CATEGORIES]
export type PageName = (typeof PAGE_NAMES)[keyof typeof PAGE_NAMES]
export type ButtonName = (typeof BUTTON_NAMES)[keyof typeof BUTTON_NAMES]
