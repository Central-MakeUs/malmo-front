import { TermsResponseDataTermsTypeEnum } from '@data/user-api-axios/api'

// 마이페이지에서 표시할 약관 타입들
export const MY_PAGE_TERMS_TYPES: readonly TermsResponseDataTermsTypeEnum[] = [
  TermsResponseDataTermsTypeEnum.ServiceUsage,
  TermsResponseDataTermsTypeEnum.PrivacyPolicy,
]

// 문의하기 URL
export const CONTACT_FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSchox69lHrxE4Cb6zGfQQBlkapYRDMoeBWdarD8JEMsB6k6Eg/viewform?usp=header'
