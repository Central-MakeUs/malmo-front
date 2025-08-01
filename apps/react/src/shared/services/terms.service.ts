import apiInstance from '../libs/api'
import { TermsApi, TermsResponseData } from '@data/user-api-axios/api'
import { queryKeys } from '../query-keys'

export interface Terms extends TermsResponseData {}

class TermsService extends TermsApi {
  constructor() {
    super(undefined, '', apiInstance)
  }

  // === Query Options ===
  termsListQuery() {
    return {
      queryKey: queryKeys.terms.list(),
      queryFn: async (): Promise<TermsResponseData[]> => {
        const { data } = await this.getTerms()
        return data?.data?.list || []
      },
    }
  }
}

export default new TermsService()
