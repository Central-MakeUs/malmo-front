import { LoveTypesApi, Configuration, LoveTypeTestResult } from '@data/user-api-axios/api'
import apiInstance from '@/shared/libs/api'

class LoveTypeService extends LoveTypesApi {
  constructor() {
    super(undefined, '', apiInstance)
  }

  // 애착유형 검사 질문 조회
  async getQuestions() {
    try {
      const response = await this.getLoveTypeQuestions()
      return response.data
    } catch (error) {
      console.error('애착유형 검사 질문 조회 실패:', error)
      throw error
    }
  }
}

export default new LoveTypeService()
