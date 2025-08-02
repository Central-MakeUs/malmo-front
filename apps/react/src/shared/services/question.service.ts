import apiInstance from '../libs/api'
import { AnswerRequestDto, QuestionsApi } from '@data/user-api-axios/api'
import { queryKeys } from '../query-keys'

class QuestionService extends QuestionsApi {
  constructor() {
    super(undefined, '', apiInstance)
  }

  // === Query Options ===
  todayQuestionQuery() {
    return {
      queryKey: queryKeys.question.today(),
      queryFn: async () => {
        const { data } = await this.getTodayQuestion()
        return data?.data
      },
    }
  }

  pastQuestionQuery(level: number) {
    return {
      queryKey: queryKeys.question.past(level),
      queryFn: async () => {
        const { data } = await this.getQuestion({ level })
        return data?.data
      },
    }
  }

  questionDetailQuery(questionId: number) {
    return {
      queryKey: queryKeys.question.detail(questionId),
      queryFn: async () => {
        const { data } = await this.getAnswers({ coupleQuestionId: questionId })
        return data?.data
      },
    }
  }

  // === Mutation Options ===
  submitAnswerMutation() {
    return {
      mutationFn: async (body: AnswerRequestDto) => {
        const { data } = await this.postAnswer({
          answerRequestDto: { ...body },
        })
        return data?.data
      },
      onError: () => {
        // TODO: 토스트 메시지로 에러 처리
      },
    }
  }

  updateAnswerMutation() {
    return {
      mutationFn: async (body: AnswerRequestDto) => {
        const { data } = await this.updateAnswer({
          answerRequestDto: { ...body },
        })
        return data?.data
      },
      onError: () => {
        // TODO: 토스트 메시지로 에러 처리
      },
    }
  }
}

export default new QuestionService()
