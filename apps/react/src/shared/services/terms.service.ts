import apiInstance from '../libs/api'
import { TermsApi, TermsResponseData } from '@data/user-api-axios/api'

export interface Terms extends TermsResponseData {}

class TermsService extends TermsApi {
  constructor() {
    super(undefined, '', apiInstance)
  }

  async findAll(): Promise<TermsResponseData[]> {
    const { data } = await this.getTerms()
    return data?.data?.list || []
  }
}

export default new TermsService()
