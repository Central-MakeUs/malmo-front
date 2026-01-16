import { BookmarksApi } from '@data/user-api-axios/api'

import { queryKeys } from './query-keys'
import apiInstance from '../lib/api'
import { toast } from '../ui/toast'

const getBookmarkErrorMessage = (error: unknown) => {
  if (error && typeof error === 'object' && 'response' in error) {
    const response = (error as { response?: { data?: { message?: string } } }).response
    const message = response?.data?.message
    if (message) return message
  }
  return null
}

class BookmarkService extends BookmarksApi {
  constructor() {
    super(undefined, '', apiInstance)
  }

  bookmarkListQuery(chatRoomId: number, options?: { page?: number; size?: number; sort?: string[] }) {
    const page = options?.page ?? 0
    const size = options?.size ?? 20
    const sort = options?.sort

    return {
      queryKey: queryKeys.bookmark.list(chatRoomId, { page, size, sort }),
      queryFn: async () => {
        const { data } = await this.getBookmarkList({
          chatRoomId,
          pageable: {
            page,
            size,
            ...(sort ? { sort } : {}),
          },
        })
        return data?.data
      },
    }
  }

  createBookmarkMutation() {
    return {
      mutationFn: async (params: { chatRoomId: number; messageId: number }) => {
        const { data } = await this.createBookmark({
          chatRoomId: params.chatRoomId,
          createBookmarkRequestDto: { messageId: params.messageId },
        })
        return data?.data
      },
      onSuccess: () => {
        toast.success('북마크에 저장했어요')
      },
      onError: (error) => {
        const message = getBookmarkErrorMessage(error) ?? '북마크 저장에 실패했어요'
        toast.error(message)
      },
    }
  }
}

export default new BookmarkService()
