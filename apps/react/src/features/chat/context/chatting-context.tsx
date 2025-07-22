import { useNavigate } from '@tanstack/react-router'
import { cn } from '@ui/common/lib/utils'
import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react'
import { useChattingModal, UseChattingModalReturn } from '../hook/use-chatting-modal'
import chatService from '@/shared/services/chat.service'
import {
  ChatRoomMessageData,
  ChatRoomMessageDataSenderTypeEnum,
  ChatRoomStateDataChatRoomStateEnum,
} from '@data/user-api-axios/api'
import { useChatSSE } from '@/features/chat/hook/use-chat-sse'

interface ChattingContextType {
  chatData: ChatRoomMessageData[] | undefined
  exitButton: () => ReactNode
  chattingModal: UseChattingModalReturn
  sendMessage: (message: string) => Promise<void>
  chatRoomState: ChatRoomStateDataChatRoomStateEnum | undefined
}
const CONNECTED_REQUIRED_MESSAGE =
  '응응! 알려줘서 고마워! 본격적인 상담은 커플 연결이 완료된 후에 시작할 수 있어. 마이페이지에서 커플 코드를 상대방에게 공유해봐!'

const ChattingContext = createContext<ChattingContextType | undefined>(undefined)

export function ChattingProvider({ children }: { children: ReactNode }) {
  const [chatData, setChatData] = useState<ChatRoomMessageData[]>([])
  const [chatRoomState, setChatRoomState] = useState<ChatRoomStateDataChatRoomStateEnum | undefined>()
  const chattingModal = useChattingModal()
  const navigate = useNavigate()

  const sendMessage = useCallback(async (message: string) => {
    if (!message.trim()) return

    const tempId = Date.now()
    const optimisticMessage: ChatRoomMessageData = {
      messageId: tempId,
      content: message,
      createdAt: new Date().toISOString(),
      senderType: ChatRoomMessageDataSenderTypeEnum.User,
    }

    setChatData((prev) => [...(prev || []), optimisticMessage])

    try {
      const { data } = await chatService.postChatroomSend({ message })
      setChatData((prev) =>
        prev.map((msg) => (msg.messageId === tempId ? { ...msg, messageId: data?.messageId } : msg))
      )
    } catch (error) {
      console.error('Failed to send message:', error)
      setChatData((prev) => prev.filter((msg) => msg.messageId !== tempId))
    }
  }, [])

  const connectedRequired = useCallback(() => {
    const createAssistantMessage = (lastMessage: ChatRoomMessageData) => ({
      messageId: Date.now(), // 고유 ID 부여
      content: CONNECTED_REQUIRED_MESSAGE,
      createdAt: lastMessage.createdAt,
      senderType: ChatRoomMessageDataSenderTypeEnum.Assistant,
    })
    setChatData((prev) => {
      if (!prev || prev.length === 0) return []
      const lastMessage = prev[prev.length - 1]
      return [...prev, createAssistantMessage(lastMessage!)]
    })
  }, [])

  const fetchChatUpgrade = useCallback(async () => {
    if (chatRoomState === ChatRoomStateDataChatRoomStateEnum.NeedNextQuestion) {
      const { data } = await chatService.postChatroomUpgrade()
      console.log('Chat room upgraded:', data)
      setChatRoomState(ChatRoomStateDataChatRoomStateEnum.Alive)
    }
  }, [chatRoomState])

  const handleChatResponse = useCallback((chunk: string) => {
    setChatData((prev) => {
      if (!prev) return []
      const lastMessage = prev[prev.length - 1]

      if (
        lastMessage &&
        lastMessage.senderType === ChatRoomMessageDataSenderTypeEnum.Assistant &&
        lastMessage.messageId === null
      ) {
        const updatedMessage = {
          ...lastMessage,
          content: (lastMessage.content || '') + chunk,
        }
        return [...prev.slice(0, -1), updatedMessage]
      } else {
        const newAssistantMessage: ChatRoomMessageData = {
          messageId: null, // 스트리밍 시작 시 ID는 null
          content: chunk,
          createdAt: new Date().toISOString(),
          senderType: ChatRoomMessageDataSenderTypeEnum.Assistant,
        }
        return [...prev, newAssistantMessage]
      }
    })
  }, [])

  const handleResponseId = useCallback((messageId: string) => {
    setChatData((prev) => {
      if (!prev) return []
      const lastIndex = prev.length - 1
      const lastMessage = prev[lastIndex]

      if (
        lastMessage &&
        lastMessage.senderType === ChatRoomMessageDataSenderTypeEnum.Assistant &&
        lastMessage.messageId === null
      ) {
        const updatedMessages = [...prev]
        updatedMessages[lastIndex] = { ...lastMessage, messageId: Number(messageId) }
        return updatedMessages
      }
      return prev
    })
  }, [])

  const handleLevelFinished = useCallback(() => {
    fetchChatUpgrade()
  }, [fetchChatUpgrade])

  const handleChatPaused = useCallback(() => {
    setChatRoomState(ChatRoomStateDataChatRoomStateEnum.Paused)
    connectedRequired()
  }, [connectedRequired])

  useChatSSE({
    onChatResponse: handleChatResponse,
    onResponseId: handleResponseId,
    onLevelFinished: handleLevelFinished,
    onChatPaused: handleChatPaused,
    onError: useCallback((error) => {
      console.error('SSE Error Callback:', error)
    }, []),
  })

  useEffect(() => {
    async function fetchChatStatus() {
      try {
        const { data: status } = await chatService.getChatroomStatus()
        setChatRoomState(status?.chatRoomState)

        if (status?.chatRoomState === ChatRoomStateDataChatRoomStateEnum.NeedNextQuestion) {
          await fetchChatUpgrade()
        }

        const { data: chatHistory } = await chatService.getCurrentChatRoomMessages()
        setChatData(chatHistory?.data?.list?.reverse() ?? [])

        if (status?.chatRoomState === ChatRoomStateDataChatRoomStateEnum.Paused) {
          connectedRequired()
        }
      } catch (e) {
        console.error('Failed to fetch initial chat status:', e)
      }
    }
    fetchChatStatus()
  }, [connectedRequired, fetchChatUpgrade])

  const exitButton = useCallback(() => {
    const actived = chatData && chatData.length > 0
    return (
      <p
        className={cn('body2-medium text-malmo-rasberry-500', { 'text-gray-300': !actived })}
        onClick={() => {
          if (actived) navigate({ to: '/chat/loading', replace: true })
        }}
      >
        종료하기
      </p>
    )
  }, [chatData, navigate])

  return (
    <ChattingContext.Provider value={{ chatData, exitButton, chattingModal, sendMessage, chatRoomState }}>
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
