import { LoveTypesApi } from '@data/user-api-axios/api'

import apiInstance from '@/shared/lib/api'

import { queryKeys } from './query-keys'

class LoveTypeService extends LoveTypesApi {
  constructor() {
    super(undefined, '', apiInstance)
  }

  // === Query Options ===
  detailQuery(personalityType: string, lovetype: string) {
    return {
      queryKey: queryKeys.loveType.detail(personalityType, lovetype),
      queryFn: async () => {
        const response = await this.getLoveTypePersonalityTypeResult({ personalityType, lovetype })
        return response.data
      },
    }
  }

  questionsQuery() {
    return {
      queryKey: queryKeys.loveType.questions(),
      queryFn: async () => {
        const response = await this.getLoveTypeQuestions()
        return response.data
      },
    }
  }

  loveTypePersonalityTypeResultQuery(personalityType: string, lovetype: string) {
    return {
      queryKey: queryKeys.loveType.result(personalityType, lovetype),
      queryFn: async () => {
        const response = await this.getLoveTypePersonalityTypeResult({ personalityType, lovetype })
        return response.data
      },
    }
  }
}

export default new LoveTypeService()
