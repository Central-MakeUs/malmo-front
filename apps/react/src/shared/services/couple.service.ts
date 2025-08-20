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
        const errorCode = error?.response?.data?.code
        if (errorCode === 40002 || errorCode === 40006 || errorCode === 40011) {
          toast.error('잘못된 초대 코드입니다')
        } else if (errorCode === 40000) {
          toast.error('초대 코드 형식이 올바르지 않습니다.')
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
