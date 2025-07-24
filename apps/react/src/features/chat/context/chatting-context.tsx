// chat/context/chatting-context.tsx

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
  streamingMessage: ChatRoomMessageData | null
  isChatStatusSuccess: boolean
}

const CONNECTED_REQUIRED_MESSAGE =
  '응응! 알려줘서 고마워! 본격적인 상담은 커플 연결이 완료된 후에 시작할 수 있어. 마이페이지에서 커플 코드를 상대방에게 공유해봐!'

const ChattingContext = createContext<ChattingContextType | undefined>(undefined)

export function ChattingProvider({ children }: { children: ReactNode }) {
  const chattingModal = useChattingModal()
  const queryClient = useQueryClient()
  const [sendingMessage, setSendingMessage] = useState<boolean>(false)
  const [streamingMessage, setStreamingMessage] = useState<ChatRoomMessageData | null>(null)

  const { data: chatStatus, isSuccess: isChatStatusSuccess } = useChatRoomStatusQuery()
  const { mutate: upgradeChatRoom } = useUpgradeChatRoomMutation()

  // 한 글자씩 오는 AI 답변을 처리하는 함수
  const handleChatResponse = useCallback((chunk: string) => {
    setStreamingMessage((prev) => {
      if (prev) {
        // 기존 스트리밍 메시지에 내용 추가
        return { ...prev, content: (prev.content || '') + chunk }
      }
      // 새로운 스트리밍 시작
      return {
        messageId: null as any,
        content: chunk,
        createdAt: new Date().toISOString(),
        senderType: ChatRoomMessageDataSenderTypeEnum.Assistant,
      }
    })
  }, [])

  // AI 답변이 완료되었을 때 호출되는 함수
  const handleResponseId = useCallback(
    (messageId: string) => {
      // 스트리밍 상태를 비우고
      setStreamingMessage(null)
      // 서버와 데이터 동기화를 위해 쿼리를 무효화하여 최신 데이터를 다시 불러옵니다.
      queryClient.invalidateQueries({ queryKey: chatKeys.messages() })
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
    queryClient.invalidateQueries({ queryKey: chatKeys.status() })
    addPausedMessage()
  }, [queryClient, addPausedMessage])

  useChatSSE(
    {
      onChatResponse: handleChatResponse,
      onResponseId: handleResponseId,
      onLevelFinished: handleLevelFinished,
      onChatPaused: handleChatPaused,
      onError: useCallback((error) => {
        console.error('SSE Error Callback:', error)
        setSendingMessage(false)
        setStreamingMessage(null)
      }, []),
    },
    isChatStatusSuccess
  )

  useEffect(() => {
    if (chatStatus === ChatRoomStateDataChatRoomStateEnum.NeedNextQuestion) {
      upgradeChatRoom()
    }
    if (chatStatus === ChatRoomStateDataChatRoomStateEnum.Paused) {
      addPausedMessage()
    }
  }, [chatStatus])

  const setSendingMessageTrue = useCallback(() => {
    setSendingMessage(true)
  }, [])

  return (
    <ChattingContext.Provider
      value={{ chattingModal, sendingMessage, setSendingMessageTrue, streamingMessage, isChatStatusSuccess }}
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
