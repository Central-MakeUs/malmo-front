import {
  BaseListSwaggerResponseChatRoomMessageData,
  ChatRoomMessageData,
  ChatRoomMessageDataSenderTypeEnum,
  ChatRoomStateDataChatRoomStateEnum,
} from '@data/user-api-axios/api'
import { InfiniteData, useQueryClient } from '@tanstack/react-query'
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react'

import { useSSESubscription } from '@/shared/contexts/sse-context'
import { ConnectionStatus } from '@/shared/hooks/use-sse'
import chatService from '@/shared/services/chat.service'
import { toast } from '@/shared/ui/toast'

import { ChatMessageTempStatus, useChatRoomStatusQuery, useUpgradeChatRoomMutation } from '../hooks/use-chat-queries'
import { useChattingModal, UseChattingModalReturn } from '../hooks/use-chatting-modal'

interface QueuedMessage {
  optimisticId: number
  content: string
}

interface ChattingContextType {
  chatStatus: ChatRoomStateDataChatRoomStateEnum | undefined
  chattingModal: UseChattingModalReturn
  sendingMessage: boolean
  streamingMessage: ChatRoomMessageData | null
  isChatStatusSuccess: boolean
  reconnectSSE: () => Promise<void>
  resetStreamingMessage: () => void
  sseStatus: ConnectionStatus
  sendMessage: (messageText: string) => void
}

export const ChattingContext = createContext<ChattingContextType | undefined>(undefined)

const TERMINATION_MESSAGE_START = '이제 대화가 종료되었어!'

export function ChattingProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const [streamingMessage, setStreamingMessage] = useState<ChatRoomMessageData | null>(null)
  const [messageQueue, setMessageQueue] = useState<QueuedMessage[]>([])
  const [isProcessingQueue, setIsProcessingQueue] = useState(false)

  const { data: chatStatus, isSuccess: isChatStatusSuccess } = useChatRoomStatusQuery()
  const { mutate: upgradeChatRoom } = useUpgradeChatRoomMutation()
  const chattingModal = useChattingModal(chatStatus)
  const queryKey = chatService.chatMessagesQuery().queryKey
  const handleChatResponse = useCallback(
    (chunk: string) => {
      if (chunk.startsWith(TERMINATION_MESSAGE_START)) {
        const queryKey = chatService.chatMessagesQuery().queryKey

        const terminationMessage: ChatRoomMessageData = {
          messageId: Date.now(),
          content: chunk,
          createdAt: new Date().toISOString(),
          senderType: ChatRoomMessageDataSenderTypeEnum.Assistant,
        }

        // streamingMessage 상태를 건너뛰고 react-query 캐시에 직접 저장
        queryClient.setQueryData<InfiniteData<BaseListSwaggerResponseChatRoomMessageData>>(queryKey, (oldData) => {
          if (!oldData) return oldData

          const newData = { ...oldData, pages: [...oldData.pages] }
          if (newData.pages.length > 0) {
            const firstPage = { ...newData.pages[0], list: [...(newData.pages[0]?.list ?? [])] }
            firstPage.list.unshift(terminationMessage)
            newData.pages[0] = firstPage
          } else {
            newData.pages.push({ list: [terminationMessage], page: 0, size: 1, totalCount: 1 })
          }
          return newData
        })

        // 다른 스트리밍 관련 상태는 확실하게 초기화
        setStreamingMessage(null)
        return // 여기서 함수 실행 종료
      }

      // 기존의 일반 스트리밍 메시지 처리 로직
      setStreamingMessage((prev) => {
        const baseMessage = {
          messageId: prev?.messageId || Date.now(),
          createdAt: prev?.createdAt || new Date().toISOString(),
          senderType: ChatRoomMessageDataSenderTypeEnum.Assistant,
        }
        return { ...baseMessage, content: (prev?.content || '') + chunk }
      })
    },
    [queryClient]
  )

  const handleResponseId = useCallback(
    (messageId: string) => {
      const queryKey = chatService.chatMessagesQuery().queryKey

      queryClient.setQueryData<InfiniteData<BaseListSwaggerResponseChatRoomMessageData>>(queryKey, (oldData) => {
        if (!oldData || !streamingMessage) return oldData

        const finalMessage = { ...streamingMessage, messageId: parseInt(messageId, 10) }

        const newData = {
          ...oldData,
          pages: oldData.pages.map((page, index) => {
            if (index === 0) {
              const newList = page.list ? [finalMessage, ...page.list] : [finalMessage]
              return { ...page, list: newList }
            }
            return { ...page, list: [...(page.list || [])] }
          }),
        }
        return newData
      })

      setStreamingMessage(null)
    },
    [queryClient, streamingMessage]
  )

  const handleLevelFinished = useCallback(() => {
    upgradeChatRoom()
  }, [upgradeChatRoom])

  const handleChatPaused = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: chatService.chatRoomStatusQuery().queryKey })
  }, [queryClient])

  const { reconnect: reconnectSSE, status: sseStatus } = useSSESubscription('chat', {
    onChatResponse: handleChatResponse,
    onResponseId: handleResponseId,
    onLevelFinished: handleLevelFinished,
    onChatPaused: handleChatPaused,
    onError: () => setStreamingMessage(null),
  })

  const resetStreamingMessage = useCallback(() => setStreamingMessage(null), [])

  const sendMessage = useCallback(
    (messageText: string) => {
      resetStreamingMessage()
      const optimisticId = Date.now()

      const optimisticMessage: ChatRoomMessageData & ChatMessageTempStatus = {
        messageId: optimisticId,
        content: messageText,
        createdAt: new Date().toISOString(),
        senderType: ChatRoomMessageDataSenderTypeEnum.User,
        status: sseStatus === 'OPEN' ? 'pending' : 'queued',
      }

      queryClient.setQueryData<InfiniteData<BaseListSwaggerResponseChatRoomMessageData>>(queryKey, (oldData) => {
        const newData = oldData ? { ...oldData, pages: [...oldData.pages] } : { pages: [], pageParams: [] }
        if (newData.pages.length > 0) {
          const firstPage = { ...newData.pages[0], list: [optimisticMessage, ...(newData.pages[0]?.list ?? [])] }
          newData.pages[0] = firstPage
        } else {
          newData.pages.push({ list: [optimisticMessage], page: 0, size: 1, totalCount: 1 })
        }
        return newData
      })

      setMessageQueue((prev) => [...prev, { optimisticId, content: messageText }])
    },
    [queryClient, queryKey, resetStreamingMessage, sseStatus]
  )

  useEffect(() => {
    const processQueue = async () => {
      if (isProcessingQueue || messageQueue.length === 0 || sseStatus !== 'OPEN') {
        return
      }

      setIsProcessingQueue(true)
      const messageToSend = messageQueue[0]
      if (!messageToSend) {
        setIsProcessingQueue(false)
        return
      }

      try {
        await chatService.sendMessageMutation().mutationFn(messageToSend.content)
        queryClient.setQueryData<InfiniteData<BaseListSwaggerResponseChatRoomMessageData>>(queryKey, (oldData) => {
          if (!oldData) return oldData
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              list: page.list?.map((msg) =>
                msg.messageId === messageToSend.optimisticId ? { ...msg, status: 'sent' } : msg
              ),
            })),
          }
        })
        setMessageQueue((prev) => prev.slice(1))
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        toast.error('메시지 전송에 실패했어요. 다시 시도해주세요.')
        queryClient.setQueryData<InfiniteData<BaseListSwaggerResponseChatRoomMessageData>>(queryKey, (oldData) => {
          if (!oldData) return oldData
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              list: page.list?.map((msg) =>
                msg.messageId === messageToSend.optimisticId ? { ...msg, status: 'failed' } : msg
              ),
            })),
          }
        })
        setMessageQueue((prev) => prev.slice(1))
      } finally {
        setIsProcessingQueue(false)
      }
    }

    void processQueue()
  }, [messageQueue, isProcessingQueue, sseStatus, queryClient, queryKey])

  return (
    <ChattingContext.Provider
      value={{
        chatStatus,
        chattingModal,
        sendingMessage: isProcessingQueue || streamingMessage != null,
        streamingMessage,
        isChatStatusSuccess,
        reconnectSSE,
        resetStreamingMessage,
        sseStatus,
        sendMessage,
      }}
    >
      {children}
    </ChattingContext.Provider>
  )
}

export function useChatting() {
  const context = useContext(ChattingContext)
  if (context === undefined) {
    throw new Error('useChatting must be used within a ChattingProvider')
  }
  return context
}
