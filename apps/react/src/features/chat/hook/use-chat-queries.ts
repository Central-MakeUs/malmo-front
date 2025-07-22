import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import chatService from '@/shared/services/chat.service'
import { ChatRoomMessageData, ChatRoomMessageDataSenderTypeEnum } from '@data/user-api-axios/api'

// 쿼리 키를 상수로 관리하여 오타를 방지하고 일관성을 유지합니다.
export const chatKeys = {
  all: ['chat'] as const,
  status: () => [...chatKeys.all, 'status'] as const,
  messages: () => [...chatKeys.all, 'messages'] as const,
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
export const useChatMessagesQuery = () => {
  return useQuery({
    queryKey: chatKeys.messages(),
    queryFn: async () => {
      const { data } = await chatService.getCurrentChatRoomMessages()
      return data?.data?.list?.reverse() ?? []
    },
  })
}

// === MUTATIONS ===

// 3. 메시지 전송을 위한 useMutation 훅 (Optimistic Update 포함)
export const useSendMessageMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (message: string) => chatService.postChatroomSend({ message }),
    onMutate: async (newMessageText) => {
      // 1. 진행중인 messages 쿼리를 취소하여 이전 서버 데이터가 덮어쓰는 것을 방지
      await queryClient.cancelQueries({ queryKey: chatKeys.messages() })

      // 2. 이전 메시지 목록을 스냅샷
      const previousMessages = queryClient.getQueryData<ChatRoomMessageData[]>(chatKeys.messages())

      // 3. 새로운 메시지를 낙관적으로 UI에 반영
      const optimisticMessage: ChatRoomMessageData = {
        messageId: Date.now(), // 임시 ID
        content: newMessageText,
        createdAt: new Date().toISOString(),
        senderType: ChatRoomMessageDataSenderTypeEnum.User,
      }
      queryClient.setQueryData<ChatRoomMessageData[]>(chatKeys.messages(), (old = []) => [...old, optimisticMessage])

      // 4. 롤백을 위해 스냅샷된 값과 임시 메시지를 context에 반환
      return { previousMessages, optimisticMessage }
    },
    onError: (err, newMessage, context) => {
      // 5. 뮤테이션 실패 시, onMutate에서 반환된 context를 사용하여 데이터 롤백
      if (context?.previousMessages) {
        queryClient.setQueryData(chatKeys.messages(), context.previousMessages)
      }
    },
    onSuccess: (data, variables, context) => {
      // 6. 뮤테이션 성공 시, 임시 메시지를 실제 서버 데이터로 업데이트
      queryClient.setQueryData<ChatRoomMessageData[]>(chatKeys.messages(), (old = []) =>
        old.map((msg) =>
          msg.messageId === context?.optimisticMessage.messageId ? { ...msg, messageId: msg.messageId } : msg
        )
      )
    },
    onSettled: () => {
      // 7. 성공/실패 여부와 관계없이 messages 쿼리를 항상 최신화
      queryClient.invalidateQueries({ queryKey: chatKeys.messages() })
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
