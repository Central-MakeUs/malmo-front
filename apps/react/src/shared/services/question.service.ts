import apiInstance from '../libs/api'
import { AnswerRequestDto, QuestionsApi } from '@data/user-api-axios/api'

class QuestionService extends QuestionsApi {
  constructor() {
    super(undefined, '', apiInstance)
  }

  async fetchTodayQuestion() {
    try {
      const { data } = await this.getTodayQuestion()
      return data
    } catch (error) {
      console.error('Error fetching today question:', error)
      throw error
    }
  }

  async fetchPastQuestion(level: number) {
    try {
      const { data } = await this.getQuestion({ level })
      return data
    } catch (error) {
      console.error('Error fetching past question:', error)
      throw error
    }
  }

  async fetchQuestionDetail(questionId: number) {
    try {
      const { data } = await this.getAnswers({ coupleQuestionId: questionId })
      return data
    } catch (error) {
      console.error('Error fetching question detail:', error)
      throw error
    }
  }

  async postTodayQuestionAnswer(body: AnswerRequestDto) {
    try {
      const { data } = await this.postAnswer({
        answerRequestDto: { ...body },
      })
      return data
    } catch (error) {
      console.error('Error posting today question answer:', error)
      throw error
    }
  }

  async patchTodayQuestionAnswer(body: AnswerRequestDto) {
    try {
      const { data } = await this.updateAnswer({
        answerRequestDto: { ...body },
      })
      return data
    } catch (error) {
      console.error('Error patching today question answer:', error)
      throw error
    }
  }
}

export default new QuestionService()
