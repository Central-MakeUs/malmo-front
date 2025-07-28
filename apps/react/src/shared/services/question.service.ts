import apiInstance from '../libs/api'
import { QuestionsApi } from '@data/user-api-axios/api'

class QuestionService extends QuestionsApi {
  constructor() {
    super(undefined, '', apiInstance)
  }

  async fetchTodayQuestion() {
    const { data } = await super.getTodayQuestion()
    return data
  }
}

export default new QuestionService()
