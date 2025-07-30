import { TermsResponseDataTermsTypeEnum } from '@data/user-api-axios/api'

// 약관 정보를 나타내는 인터페이스
export interface Term {
  termsId: number
  title: string
  content: string | null
  required: boolean
  type: TermsResponseDataTermsTypeEnum
}

// 약관 동의 상태를 나타내는 타입
export type TermAgreements = Record<number, boolean>
