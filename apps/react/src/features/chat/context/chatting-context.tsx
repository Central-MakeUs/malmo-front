import {
  ChatRoomMessageData,
  ChatRoomMessageDataSenderTypeEnum,
  ChatRoomStateDataChatRoomStateEnum,
  BaseListSwaggerResponseChatRoomMessageData,
} from '@data/user-api-axios/api'
import { InfiniteData, useQueryClient } from '@tanstack/react-query'
import { useLocation } from '@tanstack/react-router'
import { createContext, useContext, ReactNode, useCallback, useEffect, useState, useRef } from 'react'

import { useChatSSE, UseChatSSEReturn } from '@/features/chat/hooks/use-chat-sse'
import chatService from '@/shared/services/chat.service'

import { useChatRoomStatusQuery, useUpgradeChatRoomMutation } from '../hooks/use-chat-queries'
import { useChattingModal, UseChattingModalReturn } from '../hooks/use-chatting-modal'

interface ChattingContextType {
  chatStatus: ChatRoomStateDataChatRoomStateEnum | undefined
  chattingModal: UseChattingModalReturn
  sendingMessage: boolean
  setSendingMessageTrue: () => void
  streamingMessage: ChatRoomMessageData | null
  isChatStatusSuccess: boolean
  reconnectSSE: () => Promise<void>
}

export const ChattingContext = createContext<ChattingContextType | undefined>(undefined)

const TERMINATION_MESSAGE_START = '이제 대화가 종료되었어!'

export function ChattingProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const [sendingMessage, setSendingMessage] = useState<boolean>(false)
  const [streamingMessage, setStreamingMessage] = useState<ChatRoomMessageData | null>(null)
  const { pathname } = useLocation()
  const sseRef = useRef<UseChatSSEReturn | null>(null)

  const { data: chatStatus, isSuccess: isChatStatusSuccess } = useChatRoomStatusQuery()
  const { mutate: upgradeChatRoom } = useUpgradeChatRoomMutation()

  const chattingModal = useChattingModal(chatStatus)

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
      setSendingMessage(false)
    },
    [queryClient, streamingMessage]
  )

  const handleLevelFinished = useCallback(() => {
    upgradeChatRoom()
  }, [upgradeChatRoom])

  const handleChatPaused = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: chatService.chatRoomStatusQuery().queryKey })
  }, [queryClient])

  // useChatSSE 훅의 반환값을 ref에 저장합니다.
  const sse = useChatSSE(
    {
      onChatResponse: handleChatResponse,
      onResponseId: handleResponseId,
      onLevelFinished: handleLevelFinished,
      onChatPaused: handleChatPaused,
      onError: useCallback(() => {
        setSendingMessage(false)
        setStreamingMessage(null)
      }, []),
    },
    isChatStatusSuccess && pathname === '/chat'
  )
  sseRef.current = sse

  // 컨텍스트를 통해 제공할 재연결 함수
  const reconnectSSE = useCallback(async () => {
    if (sseRef.current) {
      await sseRef.current.reconnect()
    }
  }, [])

  useEffect(() => {
    if (chatStatus === ChatRoomStateDataChatRoomStateEnum.NeedNextQuestion) {
      upgradeChatRoom()
    }
  }, [chatStatus, upgradeChatRoom])

  const setSendingMessageTrue = useCallback(() => {
    setSendingMessage(true)
  }, [])

  return (
    <ChattingContext.Provider
      value={{
        chatStatus,
        chattingModal,
        sendingMessage,
        setSendingMessageTrue,
        streamingMessage,
        isChatStatusSuccess,
        reconnectSSE,
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
