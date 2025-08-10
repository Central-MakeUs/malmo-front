import { ChatroomApi } from '@data/user-api-axios/api'
import { keepPreviousData } from '@tanstack/react-query'

import { queryKeys } from './query-keys'
import apiInstance from '../lib/api'
import { toast } from '../ui/toast'

class HistoryService extends ChatroomApi {
  constructor() {
    super(undefined, '', apiInstance)
  }

  // === Query Options ===
  historyListQuery(keyword = '', isSuccess?: boolean) {
    return {
      queryKey: queryKeys.history.list(keyword),
      queryFn: async ({ pageParam = 0 }) => {
        const { data } = await this.getChatRoomList({
          pageable: { page: pageParam as number, size: 10 },
          ...(keyword && { keyword }),
        })
        return data?.data
      },
      initialPageParam: 0,
      getNextPageParam: (lastPage: any, allPages: any[]) => {
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
      placeholderData: keepPreviousData,
    }
  }

  // 특정 히스토리 메시지 조회 (무한 스크롤용)
  historyMessagesQuery(chatRoomId: number) {
    return {
      queryKey: queryKeys.history.detail(chatRoomId),
      queryFn: async ({ pageParam = 0 }) => {
        const { data } = await this.getChatRoomMessages({
          pageable: {
            page: pageParam as number,
            size: 10,
            sort: [],
          },
          chatRoomId,
        })
        return data?.data
      },
      initialPageParam: 0,
      getNextPageParam: (lastPage: any, allPages: any[]) => {
        const totalCount = lastPage?.totalCount ?? 0
        const fetchedMessagesCount = allPages.reduce((acc, page) => acc + (page.list?.length || 0), 0)

        if (fetchedMessagesCount >= totalCount) {
          return undefined
        }

        return allPages.length
      },
    }
  }

  // 히스토리 요약 조회
  historySummaryQuery(chatRoomId: number) {
    return {
      queryKey: queryKeys.history.summary(chatRoomId),
      queryFn: async () => {
        const { data } = await this.getCurrentChatRoom({ chatRoomId })
        return data?.data
      },
    }
  }

  // === Mutation Options ===
  deleteHistoryMutation() {
    return {
      mutationFn: async (chatRoomIdList: number[]) => {
        const { data } = await this.deleteChatRooms({
          deleteChatRoomRequestDto: {
            chatRoomIdList,
          },
        })
        return data?.data
      },
      onError: () => {
        toast.error('히스토리 삭제 중 오류가 발생했습니다')
      },
    }
  }
}

export default new HistoryService()
