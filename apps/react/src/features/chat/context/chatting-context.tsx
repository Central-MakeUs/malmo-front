import {
  ChatRoomMessageData,
  ChatRoomMessageDataSenderTypeEnum,
  ChatRoomStateDataChatRoomStateEnum,
  BaseListSwaggerResponseChatRoomMessageData,
} from '@data/user-api-axios/api'
import { InfiniteData, useQueryClient } from '@tanstack/react-query'
import { createContext, useContext, ReactNode, useCallback, useState } from 'react'

import { useSSESubscription } from '@/shared/contexts/sse-context'
import chatService from '@/shared/services/chat.service'

import { useChatRoomStatusQuery, useSendMessageMutation, useUpgradeChatRoomMutation } from '../hooks/use-chat-queries'
import { useChattingModal, UseChattingModalReturn } from '../hooks/use-chatting-modal'

interface ChattingContextType {
  chatStatus: ChatRoomStateDataChatRoomStateEnum | undefined
  chattingModal: UseChattingModalReturn
  sendingMessage: boolean
  streamingMessage: ChatRoomMessageData | null
  awaitingResponse: boolean
  isChatStatusSuccess: boolean
  sendMessageWithReconnect: (message: string) => Promise<void>
}

export const ChattingContext = createContext<ChattingContextType | undefined>(undefined)

const TERMINATION_MESSAGE_START = '이제 대화가 종료되었어!'

export function ChattingProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const [sendingMessage, setSendingMessage] = useState<boolean>(false)
  const [streamingMessage, setStreamingMessage] = useState<ChatRoomMessageData | null>(null)
  const [awaitingResponse, setAwaitingResponse] = useState<boolean>(false)
  const { mutate: sendMessage } = useSendMessageMutation()

  const { data: chatStatus, isSuccess: isChatStatusSuccess } = useChatRoomStatusQuery()
  const { mutate: upgradeChatRoom } = useUpgradeChatRoomMutation()

  const chattingModal = useChattingModal(chatStatus)

  const handleChatResponse = useCallback(
    (chunk: string) => {
      if (chunk.startsWith(TERMINATION_MESSAGE_START)) {
        setAwaitingResponse(false)
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
      setAwaitingResponse(false)
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
      setSendingMessage(false)
      setAwaitingResponse(false)
    },
    [queryClient, streamingMessage]
  )

  const handleLevelFinished = useCallback(() => {
    upgradeChatRoom()
  }, [upgradeChatRoom])

  const handleChatPaused = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: chatService.chatRoomStatusQuery().queryKey })
  }, [queryClient])

  const { reconnect, disconnect } = useSSESubscription('chat', {
    onChatResponse: handleChatResponse,
    onResponseId: handleResponseId,
    onLevelFinished: handleLevelFinished,
    onChatPaused: handleChatPaused,
    onError: useCallback(() => {
      setSendingMessage(false)
      setStreamingMessage(null)
      setAwaitingResponse(false)
    }, []),
  })

  const sendMessageWithReconnect = useCallback(
    async (message: string) => {
      try {
        setSendingMessage(true)
        setAwaitingResponse(true)
        setStreamingMessage(null)

        // 1. 기존 SSE 연결 종료
        disconnect()

        // 2. 새로운 SSE 연결 및 완료 대기
        await reconnect()

        // 3. 연결 완료 후 메시지 전송
        sendMessage(message, {
          onError: () => {
            setSendingMessage(false)
            setAwaitingResponse(false)
            setStreamingMessage(null)
          },
        })
      } catch (error) {
        console.error('Failed to reconnect and send message:', error)
        setSendingMessage(false) // 에러 발생 시 전송 상태 해제
        setAwaitingResponse(false)
        setStreamingMessage(null)
      }
    },
    [disconnect, reconnect, sendMessage]
  )

  return (
    <ChattingContext.Provider
      value={{
        chatStatus,
        chattingModal,
        sendingMessage,
        streamingMessage,
        awaitingResponse,
        isChatStatusSuccess,
        sendMessageWithReconnect,
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
