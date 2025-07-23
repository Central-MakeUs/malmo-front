import { useQuery, useMutation, useQueryClient, useInfiniteQuery, InfiniteData } from '@tanstack/react-query'
import chatService from '@/shared/services/chat.service'
import {
  BaseListSwaggerResponseChatRoomMessageData,
  BaseListSwaggerResponseGetChatRoomListResponse,
  ChatRoomListSuccessResponse,
  ChatRoomMessageData,
  ChatRoomMessageDataSenderTypeEnum,
} from '@data/user-api-axios/api'

// 쿼리 키를 상수로 관리하여 오타를 방지하고 일관성을 유지합니다.
export const chatKeys = {
  all: ['chat'] as const,
  status: () => [...chatKeys.all, 'status'] as const,
  messages: (sort?: string[]) => [...chatKeys.all, 'messages', sort] as const, // sort 파라미터를 키에 추가
  summary: (chatRoomId: number) => [...chatKeys.all, 'summary', chatRoomId] as const,
}

// === QUERIES ===

// 1. 채팅방 상태 조회를 위한 useQuery 훅
export const useChatRoomStatusQuery = () => {
  return useQuery({
    queryKey: chatKeys.status(),
    queryFn: () => chatService.getChatroomStatus(),
    select: (data) => data.data, // 필요한 데이터만 선택
    // 필요에 따라 staleTime, gcTime 등 옵션 추가 가능
  })
}

// 2. 현재 채팅 메시지 목록 조회를 위한 useQuery 훅
export const useChatMessagesQuery = (sort: string[] = ['createdAt']) => {
  const PAGE_SIZE = 5

  return useInfiniteQuery<BaseListSwaggerResponseChatRoomMessageData, Error>({
    queryKey: chatKeys.messages(sort),
    queryFn: async ({ pageParam = 0 }) => {
      const response = await chatService.getChatroomMessagesList({
        page: pageParam as number,
        size: PAGE_SIZE,
        sort: sort,
      })
      return response.data as BaseListSwaggerResponseChatRoomMessageData
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const lastPageList = lastPage.list ?? []
      if (lastPageList.length < PAGE_SIZE) {
        return undefined
      }
      // 다음 페이지 번호를 현재 페이지 번호 + 1로 계산
      return (lastPage.page ?? 0) + 1
    },
  })
}

// === MUTATIONS ===

// 3. 메시지 전송을 위한 useMutation 훅 (Optimistic Update 포함)
export const useSendMessageMutation = () => {
  const queryClient = useQueryClient()
  const queryKey = chatKeys.messages() // 정렬 옵션이 있다면 포함해야 합니다.

  return useMutation({
    mutationFn: (message: string) => chatService.postChatroomSend({ message }),
    onMutate: async (newMessageText) => {
      await queryClient.cancelQueries({ queryKey })

      const optimisticMessage: ChatRoomMessageData = {
        messageId: Date.now(),
        content: newMessageText,
        createdAt: new Date().toISOString(),
        senderType: ChatRoomMessageDataSenderTypeEnum.User,
      }

      // setQueryData를 InfiniteData 구조에 맞게 수정
      queryClient.setQueryData<InfiniteData<BaseListSwaggerResponseChatRoomMessageData>>(queryKey, (oldData) => {
        if (!oldData) {
          // 캐시가 없는 경우 초기 구조를 만들어줍니다.
          return {
            pages: [{ list: [optimisticMessage] }],
            pageParams: [0],
          }
        }

        const newData = { ...oldData }
        const lastPageIndex = newData.pages.length - 1
        const lastPage = { ...newData.pages[lastPageIndex] }

        // 마지막 페이지의 list에 새로운 메시지를 추가합니다.
        lastPage.list = [...(lastPage.list ?? []), optimisticMessage]
        newData.pages[lastPageIndex] = lastPage

        return newData
      })

      return { optimisticMessage }
    },
    onError: (_err, _newMessage, context) => {
      // 에러 발생 시 롤백 (필요 시 이전 데이터로 복원)
      queryClient.invalidateQueries({ queryKey })
    },
    onSuccess: (data, variables, context) => {
      // 성공 시 임시 ID를 실제 서버 ID로 교체
      queryClient.setQueryData<InfiniteData<BaseListSwaggerResponseChatRoomMessageData>>(queryKey, (oldData) => {
        if (!oldData) return oldData

        oldData.pages.forEach((page) => {
          page.list?.forEach((msg) => {
            if (msg.messageId === context?.optimisticMessage.messageId) {
              msg.messageId = data.data?.messageId
            }
          })
        })
        return oldData
      })
    },
  })
}

// 4. 채팅방 업그레이드를 위한 useMutation 훅
export const useUpgradeChatRoomMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => chatService.postChatroomUpgrade(),
    onSuccess: () => {
      // 채팅방 상태가 변경되었으므로 status 쿼리를 최신화
      queryClient.invalidateQueries({ queryKey: chatKeys.status() })
    },
  })
}
