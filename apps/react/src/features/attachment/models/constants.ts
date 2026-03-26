import type { MemberDataLoveTypeCategoryEnum } from '@data/user-api-axios/api'

// 질문 페이지 설정
export const QUESTION_CONFIG = {
  TOTAL_PAGES: 4,
  QUESTIONS_PER_PAGE: 9,
  SUBMISSION_DELAY: 2000,
}

// 스코어 범위 설정
export const SCORE_RANGE = {
  MIN: 1,
  MAX: 5,
}

// 애착유형 선택 옵션
export const ATTACHMENT_OPTIONS: { label: string; value: MemberDataLoveTypeCategoryEnum }[] = [
  { label: '연인을 신뢰하고 감정을 잘 표현하는 안정형', value: 'STABLE_TYPE' },
  { label: '연인과 멀어질까봐 자주 걱정하는 불안형', value: 'ANXIETY_TYPE' },
  { label: '연인과의 관계가 좁혀질수록 거리가 필요한 회피형', value: 'AVOIDANCE_TYPE' },
  { label: '연인과 가까워지고 싶지만 거리를 두게 되는 혼란형', value: 'CONFUSION_TYPE' },
]
