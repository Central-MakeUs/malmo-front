import { useQuery } from '@tanstack/react-query'
import questionService from '@/shared/services/question.service'

export function useTodayQuestion() {
  return useQuery({
    queryKey: ['todayQuestion'],
    queryFn: () => questionService.fetchTodayQuestion(),
    select: (data) => data?.data,
  })
}
