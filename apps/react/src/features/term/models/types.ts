import { TermsResponseDataTermsTypeEnum } from '@data/user-api-axios/api'

// 약관 상세 정보 (type과 content로 구성)
export interface TermDetail {
  type: string
  content: string
}

// 약관 정보 인터페이스
export interface Term {
  termsId: number
  title: string
  details: TermDetail[] | null // content에서 details로 변경
  required: boolean
  type: TermsResponseDataTermsTypeEnum
}

// 약관 동의 상태
export type TermAgreements = Record<number, boolean>
