import { useInfiniteQuery } from '@tanstack/react-query'
import historyService from '@/shared/services/history.service'

interface UseChatHistoryQueryProps {
  keyword?: string
  isSuccess?: boolean
}

export function useChatHistoryQuery({ keyword = '', isSuccess }: UseChatHistoryQueryProps) {
  return useInfiniteQuery({
    queryKey: ['histories', keyword],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await historyService.getHistoryList({
        pageable: { page: pageParam, size: 10 },
        ...(keyword && { keyword }),
      })
      return response.data
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage || lastPage.totalCount == null) {
        return undefined
      }
      const fetchedItemsCount = allPages.flatMap((page) => page?.list || []).length
      if (fetchedItemsCount >= lastPage.totalCount) {
        return undefined
      }
      return allPages.length
    },
    enabled: isSuccess,
  })
}
