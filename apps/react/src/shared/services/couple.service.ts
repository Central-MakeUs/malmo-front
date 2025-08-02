import apiInstance from '../libs/api'
import { CouplesApi, CoupleLinkRequestDto } from '@data/user-api-axios/api'

export const QUERY_KEY = 'couples'

class CoupleService extends CouplesApi {
  constructor() {
    super(undefined, '', apiInstance)
  }

  // === Mutation Options ===
  connectCoupleMutation() {
    return {
      mutationFn: async (partnerCode: string) => {
        const requestDto: CoupleLinkRequestDto = {
          coupleCode: partnerCode,
        }
        const { data } = await this.linkCouple({ coupleLinkRequestDto: requestDto })
        return data
      },
    }
  }

  disconnectCoupleMutation() {
    return {
      mutationFn: async () => {
        const { data } = await this.unlinkCouple()
        return data
      },
    }
  }
}

export default new CoupleService()
