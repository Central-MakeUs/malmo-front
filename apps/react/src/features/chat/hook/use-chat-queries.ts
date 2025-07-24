import { useQuery, useMutation, useQueryClient, useInfiniteQuery, InfiniteData } from '@tanstack/react-query'
import chatService from '@/shared/services/chat.service'
import {
  BaseListSwaggerResponseChatRoomMessageData,
  ChatRoomMessageData,
  ChatRoomMessageDataSenderTypeEnum,
} from '@data/user-api-axios/api'

export const chatKeys = {
  all: ['chat'] as const,
  status: () => [...chatKeys.all, 'status'] as const,
  messages: () => [...chatKeys.all, 'messages'] as const,
  summary: (chatRoomId: number) => [...chatKeys.all, 'summary', chatRoomId] as const,
}

// === QUERIES ===

export const useChatRoomStatusQuery = () => {
  return useQuery({
    queryKey: chatKeys.status(),
    queryFn: () => chatService.getChatroomStatus(),
    select: (data) => {
      return data.data?.chatRoomState
    },
  })
}

// 2. 채팅 메시지 목록 조회를 위한 useInfiniteQuery 훅 (수정)
// 비효율적인 select 옵션을 제거하여 원본 데이터를 그대로 반환합니다.
export const useChatMessagesQuery = (enabled: boolean) => {
  const PAGE_SIZE = 20

  return useInfiniteQuery<BaseListSwaggerResponseChatRoomMessageData, Error>({
    queryKey: chatKeys.messages(),
    queryFn: async ({ pageParam = 0 }) => {
      const response = await chatService.getChatroomMessagesList({
        page: pageParam as number,
        size: PAGE_SIZE,
        sort: [],
      })
      return response.data as BaseListSwaggerResponseChatRoomMessageData
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const totalCount = lastPage.totalCount ?? 0
      const fetchedMessagesCount = allPages.reduce((acc, page) => acc + (page.list?.length || 0), 0)

      if (fetchedMessagesCount >= totalCount) {
        return undefined
      }
      return (lastPage.page ?? 0) + 1
    },
    enabled,
  })
}

// === MUTATIONS ===

// 3. 메시지 전송을 위한 useMutation 훅 (이전과 동일)
export const useSendMessageMutation = () => {
  const queryClient = useQueryClient()
  const queryKey = chatKeys.messages()

  return useMutation({
    mutationFn: (message: string) => chatService.postChatroomSend({ message }),
    onMutate: async (newMessageText) => {
      await queryClient.cancelQueries({ queryKey })
      const previousMessages = queryClient.getQueryData(queryKey)

      const optimisticMessage: ChatRoomMessageData = {
        messageId: Date.now(),
        content: newMessageText,
        createdAt: new Date().toISOString(),
        senderType: ChatRoomMessageDataSenderTypeEnum.User,
      }

      queryClient.setQueryData<InfiniteData<BaseListSwaggerResponseChatRoomMessageData>>(queryKey, (oldData) => {
        const newData = oldData ? { ...oldData, pages: [...oldData.pages] } : { pages: [], pageParams: [] }
        if (newData.pages.length > 0) {
          const firstPage = { ...newData.pages[0], list: [...(newData.pages[0]?.list ?? [])] }
          firstPage.list.unshift(optimisticMessage)
          newData.pages[0] = firstPage
        } else {
          newData.pages.push({
            list: [optimisticMessage],
            page: 0,
            size: 1,
            totalCount: 1,
          })
        }
        return newData
      })

      return { previousMessages }
    },
    onError: (err, newMessage, context) => {
      if (context?.previousMessages) {
        queryClient.setQueryData(queryKey, context.previousMessages)
      }
    },
  })
}

// 4. 채팅방 업그레이드를 위한 useMutation 훅 (이전과 동일)
export const useUpgradeChatRoomMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => chatService.postChatroomUpgrade(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatKeys.status() })
    },
  })
}
