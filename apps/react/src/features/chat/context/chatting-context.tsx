import { createContext, useContext, ReactNode, useCallback, useEffect, useState } from 'react'
import { useChattingModal, UseChattingModalReturn } from '../hook/use-chatting-modal'
import {
  BaseListSwaggerResponseChatRoomMessageData,
  ChatRoomMessageData,
  ChatRoomMessageDataSenderTypeEnum,
  ChatRoomStateDataChatRoomStateEnum,
} from '@data/user-api-axios/api'
import { useChatSSE } from '@/features/chat/hook/use-chat-sse'
import { InfiniteData, useQueryClient } from '@tanstack/react-query'
import { chatKeys, useChatRoomStatusQuery, useUpgradeChatRoomMutation } from '../hook/use-chat-queries'

interface ChattingContextType {
  chattingModal: UseChattingModalReturn
  sendingMessage: boolean
  setSendingMessageTrue: () => void
}

const CONNECTED_REQUIRED_MESSAGE =
  '응응! 알려줘서 고마워! 본격적인 상담은 커플 연결이 완료된 후에 시작할 수 있어. 마이페이지에서 커플 코드를 상대방에게 공유해봐!'

const ChattingContext = createContext<ChattingContextType | undefined>(undefined)

export function ChattingProvider({ children }: { children: ReactNode }) {
  const chattingModal = useChattingModal()
  const queryClient = useQueryClient()
  const [sendingMessage, setSendingMessage] = useState<boolean>(false)

  // Tanstack Query 훅을 사용하여 데이터와 상태를 가져옵니다.
  const { data: chatStatus } = useChatRoomStatusQuery()
  const { mutate: upgradeChatRoom } = useUpgradeChatRoomMutation()

  // 채팅 상태가 변경될 때마다 쿼리를 무효화하여 최신 상태를 유지합니다.
  const handleChatResponse = useCallback(
    (chunk: string) => {
      queryClient.setQueryData<InfiniteData<BaseListSwaggerResponseChatRoomMessageData>>(
        chatKeys.messages(),
        (oldData) => {
          if (!oldData) return oldData

          const newData = { ...oldData }
          const lastPageIndex = newData.pages.length - 1
          const lastPage = { ...newData.pages[lastPageIndex] }
          const messages = [...(lastPage.list ?? [])]
          const lastMessage = messages[messages.length - 1]

          if (
            lastMessage?.senderType === ChatRoomMessageDataSenderTypeEnum.Assistant &&
            lastMessage.messageId === null
          ) {
            // AI 응답 스트리밍 중: 마지막 메시지에 내용 추가
            const updatedMessage = { ...lastMessage, content: (lastMessage.content || '') + chunk }
            messages[messages.length - 1] = updatedMessage
          } else {
            // AI 응답 시작: 새로운 메시지 객체 추가
            const newAssistantMessage: ChatRoomMessageData = {
              messageId: null as any,
              content: chunk,
              createdAt: new Date().toISOString(),
              senderType: ChatRoomMessageDataSenderTypeEnum.Assistant,
            }
            messages.push(newAssistantMessage)
          }

          lastPage.list = messages
          newData.pages[lastPageIndex] = lastPage
          return newData
        }
      )
    },
    [queryClient]
  )

  const handleResponseId = useCallback(
    (messageId: string) => {
      queryClient.setQueryData<InfiniteData<BaseListSwaggerResponseChatRoomMessageData>>(
        chatKeys.messages(),
        (oldData) => {
          if (!oldData) return oldData

          const newData = { ...oldData }
          const lastPageIndex = newData.pages.length - 1
          const lastPage = { ...newData.pages[lastPageIndex] }
          const messages = [...(lastPage.list ?? [])]
          const lastMessageIndex = messages.length - 1

          if (messages[lastMessageIndex]?.messageId === null) {
            messages[lastMessageIndex] = { ...messages[lastMessageIndex]!, messageId: Number(messageId) }
          }

          lastPage.list = messages
          newData.pages[lastPageIndex] = lastPage
          return newData
        }
      )
      setSendingMessage(false)
    },
    [queryClient]
  )

  const handleLevelFinished = useCallback(() => {
    upgradeChatRoom()
  }, [upgradeChatRoom])

  const addPausedMessage = useCallback(() => {
    queryClient.setQueryData<InfiniteData<BaseListSwaggerResponseChatRoomMessageData>>(
      chatKeys.messages(),
      (oldData) => {
        if (!oldData || oldData.pages.length === 0) return oldData

        const lastPageMessages = oldData?.pages?.[oldData.pages.length - 1]?.list ?? []
        if (lastPageMessages.some((msg) => msg.content === CONNECTED_REQUIRED_MESSAGE)) {
          return oldData // 이미 메시지가 있으면 추가하지 않음
        }

        const newData = { ...oldData }
        const lastPageIndex = newData.pages.length - 1
        const lastPage = { ...newData.pages[lastPageIndex] }
        const messages = [...(lastPage.list ?? [])]

        const assistantMessage: ChatRoomMessageData = {
          messageId: Date.now(),
          content: CONNECTED_REQUIRED_MESSAGE,
          createdAt: new Date().toISOString(),
          senderType: ChatRoomMessageDataSenderTypeEnum.Assistant,
        }
        messages.push(assistantMessage)

        lastPage.list = messages
        newData.pages[lastPageIndex] = lastPage
        return newData
      }
    )
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

  const setSendingMessageTrue = useCallback(() => {
    setSendingMessage(true)
  }, [])

  // Context를 통해 제공하는 값에서 데이터 관련 로직은 모두 제거
  return (
    <ChattingContext.Provider value={{ chattingModal, sendingMessage, setSendingMessageTrue }}>
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
