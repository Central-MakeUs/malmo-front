import apiInstance from '../libs/api'
import { AnswerRequestDto, QuestionsApi } from '@data/user-api-axios/api'
import { queryKeys } from '../query-keys'
import { toast } from '../components/toast'

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
        toast.error('답변 제출 중 오류가 발생했습니다')
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
        toast.error('답변 수정 중 오류가 발생했습니다')
      },
    }
  }
}

export default new QuestionService()
