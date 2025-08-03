import { TermsResponseData, TermsResponseDataTermsTypeEnum } from '@data/user-api-axios/api'
import { Term } from '../models/types'

// API 응답 데이터를 내부 Term 모델로 변환
export function convertToTerms(data: TermsResponseData[]): Term[] {
  if (!Array.isArray(data)) {
    return []
  }

  return data.map((item) => ({
    termsId: item.content?.termsId || 0,
    title: item.content?.title || '',
    details: item.content?.details
      ? item.content.details.map((detail) => ({
          ...detail,
          type: detail.type || 'default',
          content: detail.content || '',
        }))
      : null,
    required: item.content?.isRequired || false,
    type: item.termsType || TermsResponseDataTermsTypeEnum.AgeVerification, // 기본값 설정
  }))
}

// ID로 약관 찾기
export function findTermById(terms: Term[], termsId: number): Term | undefined {
  return terms.find((term) => term.termsId === termsId)
}
