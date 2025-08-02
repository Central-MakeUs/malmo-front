import apiInstance from '../libs/api'
import { CouplesApi, CoupleLinkRequestDto } from '@data/user-api-axios/api'

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
      onError: () => {
        // TODO: 토스트 메시지로 에러 처리
      },
    }
  }

  disconnectCoupleMutation() {
    return {
      mutationFn: async () => {
        const { data } = await this.unlinkCouple()
        return data
      },
      onError: () => {
        // TODO: 토스트 메시지로 에러 처리
      },
    }
  }
}

export default new CoupleService()
