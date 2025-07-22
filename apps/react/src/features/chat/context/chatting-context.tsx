import { createContext, useContext, ReactNode, useCallback, useEffect } from 'react'
import { useChattingModal, UseChattingModalReturn } from '../hook/use-chatting-modal'
import {
  ChatRoomMessageData,
  ChatRoomMessageDataSenderTypeEnum,
  ChatRoomStateDataChatRoomStateEnum,
} from '@data/user-api-axios/api'
import { useChatSSE } from '@/features/chat/hook/use-chat-sse'
import { useQueryClient } from '@tanstack/react-query'
import { chatKeys, useChatRoomStatusQuery, useUpgradeChatRoomMutation } from '../hook/use-chat-queries'

interface ChattingContextType {
  chattingModal: UseChattingModalReturn
}

const CONNECTED_REQUIRED_MESSAGE =
  '응응! 알려줘서 고마워! 본격적인 상담은 커플 연결이 완료된 후에 시작할 수 있어. 마이페이지에서 커플 코드를 상대방에게 공유해봐!'

const ChattingContext = createContext<ChattingContextType | undefined>(undefined)

export function ChattingProvider({ children }: { children: ReactNode }) {
  const chattingModal = useChattingModal()
  const queryClient = useQueryClient()

  // Tanstack Query 훅을 사용하여 데이터와 상태를 가져옵니다.
  const { data: chatStatus } = useChatRoomStatusQuery()
  const { mutate: upgradeChatRoom } = useUpgradeChatRoomMutation()

  // SSE 이벤트 핸들러: 이제 queryClient.setQueryData를 사용하여 캐시를 직접 업데이트합니다.
  const handleChatResponse = useCallback(
    (chunk: string) => {
      queryClient.setQueryData<ChatRoomMessageData[]>(chatKeys.messages(), (prev = []) => {
        const lastMessage = prev[prev.length - 1]
        if (lastMessage?.senderType === ChatRoomMessageDataSenderTypeEnum.Assistant && lastMessage.messageId === null) {
          const updatedMessage = { ...lastMessage, content: (lastMessage.content || '') + chunk }
          return [...prev.slice(0, -1), updatedMessage]
        } else {
          const newAssistantMessage: ChatRoomMessageData = {
            messageId: null,
            content: chunk,
            createdAt: new Date().toISOString(),
            senderType: ChatRoomMessageDataSenderTypeEnum.Assistant,
          }
          return [...prev, newAssistantMessage]
        }
      })
    },
    [queryClient]
  )

  const handleResponseId = useCallback(
    (messageId: string) => {
      queryClient.setQueryData<ChatRoomMessageData[]>(chatKeys.messages(), (prev = []) => {
        const lastIndex = prev.length - 1
        if (prev[lastIndex]?.messageId === null) {
          const updatedMessages = [...prev]
          updatedMessages[lastIndex] = { ...updatedMessages[lastIndex]!, messageId: Number(messageId) }
          return updatedMessages
        }
        return prev
      })
    },
    [queryClient]
  )

  const handleLevelFinished = useCallback(() => {
    upgradeChatRoom()
  }, [upgradeChatRoom])

  const addPausedMessage = useCallback(() => {
    queryClient.setQueryData<ChatRoomMessageData[]>(chatKeys.messages(), (prev = []) => {
      if (!prev.length) return prev
      // 이미 PAUSED 메시지가 있는지 확인하여 중복 추가 방지
      if (prev.some((msg) => msg.content === CONNECTED_REQUIRED_MESSAGE)) {
        return prev
      }
      const lastMessage = prev[prev.length - 1]!
      const assistantMessage: ChatRoomMessageData = {
        messageId: Date.now(),
        content: CONNECTED_REQUIRED_MESSAGE,
        createdAt: lastMessage.createdAt,
        senderType: ChatRoomMessageDataSenderTypeEnum.Assistant,
      }
      return [...prev, assistantMessage]
    })
  }, [queryClient])

  const handleChatPaused = useCallback(() => {
    // 상태를 직접 변경하는 대신, status 쿼리를 무효화하여 최신 상태를 가져오게 함
    queryClient.invalidateQueries({ queryKey: chatKeys.status() })
    addPausedMessage()
  }, [queryClient, addPausedMessage])

  // SSE 연결 훅
  useChatSSE({
    onChatResponse: handleChatResponse,
    onResponseId: handleResponseId,
    onLevelFinished: handleLevelFinished,
    onChatPaused: handleChatPaused,
    onError: useCallback((error) => {
      console.error('SSE Error Callback:', error)
    }, []),
  })

  // 초기 상태 확인 및 처리
  useEffect(() => {
    if (chatStatus?.chatRoomState === ChatRoomStateDataChatRoomStateEnum.NeedNextQuestion) {
      upgradeChatRoom()
    }
    if (chatStatus?.chatRoomState === ChatRoomStateDataChatRoomStateEnum.Paused) {
      addPausedMessage()
    }
  }, [chatStatus, upgradeChatRoom, addPausedMessage])

  // Context를 통해 제공하는 값에서 데이터 관련 로직은 모두 제거
  return <ChattingContext.Provider value={{ chattingModal }}>{children}</ChattingContext.Provider>
}

export function useChatting() {
  const context = useContext(ChattingContext)
  if (context === undefined) {
    throw new Error('useChatting must be used within a ChattingProvider')
  }
  return context
}
