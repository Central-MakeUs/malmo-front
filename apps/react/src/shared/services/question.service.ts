import apiInstance from '../libs/api'
import { AnswerRequestDto, QuestionsApi } from '@data/user-api-axios/api'

class QuestionService extends QuestionsApi {
  constructor() {
    super(undefined, '', apiInstance)
  }

  async fetchTodayQuestion() {
    const { data } = await this.getTodayQuestion()
    return data
  }

  async fetchPastQuestion(level: number) {
    const { data } = await this.getQuestion({ level })
    return data
  }

  async fetchQuestionDetail(questionId: number) {
    const { data } = await this.getAnswers({ coupleQuestionId: questionId })
    return data
  }

  async postTodayQuestionAnswer(body: AnswerRequestDto) {
    const { data } = await this.postAnswer({
      answerRequestDto: { ...body },
    })
    return data
  }

  async patchTodayQuestionAnswer(body: AnswerRequestDto) {
    const { data } = await this.updateAnswer({
      answerRequestDto: { ...body },
    })
    return data
  }
}

export default new QuestionService()
