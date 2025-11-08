import { useQuery, type UseQueryOptions } from '@tanstack/react-query'

import questionService from '@/shared/services/question.service'

type TodayQuestionQueryOptions = ReturnType<typeof questionService.todayQuestionQuery>
type TodayQuestionQueryKey = TodayQuestionQueryOptions['queryKey']
type TodayQuestionData = Awaited<ReturnType<TodayQuestionQueryOptions['queryFn']>>

type TodayQuestionOptions = Omit<
  UseQueryOptions<TodayQuestionData, Error, TodayQuestionData, TodayQuestionQueryKey>,
  'queryKey' | 'queryFn'
>

export function useTodayQuestion(options?: TodayQuestionOptions) {
  const baseOptions = questionService.todayQuestionQuery()
  return useQuery({
    ...baseOptions,
    ...options,
  })
}
