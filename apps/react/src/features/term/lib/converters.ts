import { TermsResponseData } from '@data/user-api-axios/api'
import { Term } from '../models/types'

// 타입 변환 함수
export function convertToTerms(data: TermsResponseData[]): Term[] {
  return data.map((item) => ({
    termsId: item.termsId || 0,
    title: item.title || '',
    content: item.content || null,
    required: item.isRequired || false,
  }))
}

// 약관 ID로 약관을 찾는 함수
export function findTermById(terms: Term[], termsId: number): Term | undefined {
  return terms.find((term) => term.termsId === termsId)
}
