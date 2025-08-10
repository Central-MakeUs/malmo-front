import { useInfiniteQuery } from '@tanstack/react-query'

import historyService from '@/shared/services/history.service'

interface UseChatHistoryQueryProps {
  keyword?: string
  isSuccess?: boolean
}

export function useChatHistoryQuery({ keyword = '', isSuccess }: UseChatHistoryQueryProps) {
  return useInfiniteQuery(historyService.historyListQuery(keyword, isSuccess))
}
