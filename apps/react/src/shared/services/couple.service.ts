import { queryOptions } from '@tanstack/react-query'
import apiInstance from '../libs/api'
import { CouplesApi, CoupleLinkRequestDto, CoupleLinkSuccessResponse } from '@data/user-api-axios/api'

export const QUERY_KEY = 'couples'

class CoupleService extends CouplesApi {
  constructor() {
    super(undefined, '', apiInstance)
  }

  async connectCouple(partnerCode: string) {
    const requestDto: CoupleLinkRequestDto = {
      coupleCode: partnerCode,
    }
    const { data } = await super.linkCouple({ coupleLinkRequestDto: requestDto })
    return data
  }

  async disconnectCouple() {
    const { data } = await super.unlinkCouple()
    return data
  }

  connectCoupleMutation() {
    return {
      mutationKey: [QUERY_KEY, 'link'],
      mutationFn: (partnerCode: string) => this.connectCouple(partnerCode),
    }
  }
}

export default new CoupleService()
