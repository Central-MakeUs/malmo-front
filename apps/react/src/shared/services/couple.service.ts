import { CouplesApi, CoupleLinkRequestDto } from '@data/user-api-axios/api'

import apiInstance from '../lib/api'
import { toast } from '../ui/toast'

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
      onError: (error: any) => {
        // 잠못된 초대 코드 에러 코드들 (40002: 존재하지 않음, 40006: 이미 사용됨)
        const errorCode = error?.response?.data?.code
        if (errorCode === 40002 || errorCode === 40006) {
          toast.error('잘못된 초대 코드입니다')
        } else {
          toast.error('커플 연결 중 오류가 발생했습니다')
        }
      },
    }
  }

  disconnectCoupleMutation() {
    return {
      mutationFn: async () => {
        const { data } = await this.unlinkCouple()
        return data
      },
      onSuccess: () => {
        toast.success('커플 연결이 끊어졌어요')
      },
      onError: () => {
        toast.error('커플 연결 끊기 중 오류가 발생했습니다')
      },
    }
  }
}

export default new CoupleService()
