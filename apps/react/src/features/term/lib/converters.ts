import { TermsResponseData, TermsResponseDataTermsTypeEnum } from '@data/user-api-axios/api'
import { Term } from '../models/types'

// 타입 변환 함수
export function convertToTerms(data: TermsResponseData[]): Term[] {
  return data.map((item) => ({
    termsId: item.content?.termsId || 0,
    title: item.content?.title || '',
    content: item.content?.content || null, // content가 없으면 null
    required: item.content?.isRequired || false,
    type: item.termsType || TermsResponseDataTermsTypeEnum.AgeVerification, // 기본값 설정
  }))
}

// 약관 ID로 약관을 찾는 함수
export function findTermById(terms: Term[], termsId: number): Term | undefined {
  return terms.find((term) => term.termsId === termsId)
}
