import { createContext, useContext, ReactNode, useCallback, useEffect, useState } from 'react'
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
  chatStatus: ChatRoomStateDataChatRoomStateEnum | undefined
  chattingModal: UseChattingModalReturn
  sendingMessage: boolean
  setSendingMessageTrue: () => void
  streamingMessage: ChatRoomMessageData | null
  isChatStatusSuccess: boolean
}

const ChattingContext = createContext<ChattingContextType | undefined>(undefined)

export function ChattingProvider({ children }: { children: ReactNode }) {
  const chattingModal = useChattingModal()
  const queryClient = useQueryClient()
  const [sendingMessage, setSendingMessage] = useState<boolean>(false)
  const [streamingMessage, setStreamingMessage] = useState<ChatRoomMessageData | null>(null)

  const { data: chatStatus, isSuccess: isChatStatusSuccess } = useChatRoomStatusQuery()
  const { mutate: upgradeChatRoom } = useUpgradeChatRoomMutation()

  const handleChatResponse = useCallback((chunk: string) => {
    setStreamingMessage((prev) => {
      if (prev) {
        return { ...prev, content: (prev.content || '') + chunk }
      }
      return {
        messageId: null as any,
        content: chunk,
        createdAt: new Date().toISOString(),
        senderType: ChatRoomMessageDataSenderTypeEnum.Assistant,
      }
    })
  }, [])

  const handleResponseId = useCallback(
    async (messageId: string) => {
      await queryClient.invalidateQueries({ queryKey: chatKeys.messages() })
      setStreamingMessage(null)
      setSendingMessage(false)
    },
    [queryClient]
  )

  const handleLevelFinished = useCallback(() => {
    upgradeChatRoom()
  }, [upgradeChatRoom])

  const handleChatPaused = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: chatKeys.status() })
  }, [queryClient])

  useChatSSE(
    {
      onChatResponse: handleChatResponse,
      onResponseId: handleResponseId,
      onLevelFinished: handleLevelFinished,
      onChatPaused: handleChatPaused,
      onError: useCallback((error) => {
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
