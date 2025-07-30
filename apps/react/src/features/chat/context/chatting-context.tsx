import { createContext, useContext, ReactNode, useCallback, useEffect, useState } from 'react'
import { useChattingModal, UseChattingModalReturn } from '../hook/use-chatting-modal'
import {
  ChatRoomMessageData,
  ChatRoomMessageDataSenderTypeEnum,
  ChatRoomStateDataChatRoomStateEnum,
  BaseListSwaggerResponseChatRoomMessageData,
} from '@data/user-api-axios/api'
import { useChatSSE } from '@/features/chat/hook/use-chat-sse'
import { InfiniteData, useQueryClient } from '@tanstack/react-query'
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
      const baseMessage = {
        messageId: prev?.messageId || Date.now(),
        createdAt: prev?.createdAt || new Date().toISOString(),
        senderType: ChatRoomMessageDataSenderTypeEnum.Assistant,
      }
      return { ...baseMessage, content: (prev?.content || '') + chunk }
    })
  }, [])

  const handleResponseId = useCallback(
    (messageId: string) => {
      const queryKey = chatKeys.messages()

      queryClient.setQueryData<InfiniteData<BaseListSwaggerResponseChatRoomMessageData>>(queryKey, (oldData) => {
        if (!oldData || !streamingMessage) return oldData

        const finalMessage = { ...streamingMessage, messageId: parseInt(messageId, 10) }

        // 불변성을 유지하며 새로운 데이터 생성
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
    await queryClient.invalidateQueries({ queryKey: chatKeys.status() })
  }, [queryClient])

  useChatSSE(
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
