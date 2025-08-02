import { LoveTypesApi } from '@data/user-api-axios/api'
import apiInstance from '@/shared/libs/api'
import { queryKeys } from '../query-keys'

class LoveTypeService extends LoveTypesApi {
  constructor() {
    super(undefined, '', apiInstance)
  }

  // === Query Options ===
  questionsQuery() {
    return {
      queryKey: queryKeys.loveType.questions(),
      queryFn: async () => {
        const response = await this.getLoveTypeQuestions()
        return response.data
      },
    }
  }
}

export default new LoveTypeService()
