import {
  ChatRoomStateDataChatRoomStateEnum,
  ChatRoomMessageData,
  ChatRoomMessageDataSenderTypeEnum,
  BaseListSwaggerResponseChatRoomMessageData,
} from '@data/user-api-axios/api'
import { useQuery, useMutation, useQueryClient, useInfiniteQuery, InfiniteData } from '@tanstack/react-query'

import chatService from '@/shared/services/chat.service'
import historyService from '@/shared/services/history.service'

export interface ChatMessageTempStatus {
  status?: 'failed' | 'sent' | 'pending' | 'queued'
}

const CONNECTED_REQUIRED_MESSAGE =
  '알려줘서 고마워! 그런데, 본격적인 상담은 커플 연결이 완료된 후에 시작할 수 있어. 마이페이지에서 커플 코드를 연인에게 공유해봐!'

export const useChatRoomStatusQuery = () => {
  return useQuery(chatService.chatRoomStatusQuery())
}

export const useChatMessagesQuery = (
  enabled: boolean,
  chatStatus: ChatRoomStateDataChatRoomStateEnum | undefined,
  chatId?: number
) => {
  if (chatId) {
    return useInfiniteQuery({
      ...historyService.historyMessagesQuery(chatId),
    })
  }

  return useInfiniteQuery({
    ...chatService.chatMessagesQuery(),
    select: (data) => {
      if (chatStatus !== ChatRoomStateDataChatRoomStateEnum.Paused) return data

      const newData = JSON.parse(JSON.stringify(data)) as InfiniteData<BaseListSwaggerResponseChatRoomMessageData>

      const assistantMessage: ChatRoomMessageData = {
        messageId: Date.now(),
        content: CONNECTED_REQUIRED_MESSAGE,
        createdAt: new Date().toISOString(),
        senderType: ChatRoomMessageDataSenderTypeEnum.Assistant,
      }

      const firstPageList = newData.pages[0]?.list
      if (firstPageList?.some((msg) => msg.content === CONNECTED_REQUIRED_MESSAGE)) return newData

      newData.pages[0]?.list?.unshift(assistantMessage)

      return newData
    },
    enabled,
  })
}

export const useUpgradeChatRoomMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    ...chatService.upgradeChatRoomMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatService.chatRoomStatusQuery().queryKey })
    },
  })
}
