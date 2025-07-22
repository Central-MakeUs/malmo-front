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
import { useChatSSE } from '@/shared/hook/use-chat-sse'

interface ChattingContextType {
  chatData: ChatRoomMessageData[] | undefined
  exitButton: () => ReactNode
  chattingModal: UseChattingModalReturn
  sendMessage: (message: string) => Promise<void>
  chatRoomState: ChatRoomStateDataChatRoomStateEnum | undefined
}

const CONNECTED_REQUIRED_MESSAGE =
  '응응! 알려줘서 고마워! 본격적인 상담은 커플 연결이 완료된 후에 시작할 수 있어. 마이페이지에서 커플 코드를 상대방에게 공유해봐!'

// 컨텍스트 생성
const ChattingContext = createContext<ChattingContextType | undefined>(undefined)

// 컨텍스트 프로바이더 컴포넌트
export function ChattingProvider({ children }: { children: ReactNode }) {
  const [chatData, setChatData] = useState<ChatRoomMessageData[] | undefined>(undefined)
  const [chatRoomState, setChatRoomState] = useState<ChatRoomStateDataChatRoomStateEnum | undefined>(undefined)
  const chattingModal = useChattingModal()
  const navigate = useNavigate()

  const sendMessage = async (message: string) => {
    if (!message.trim()) return

    const { data } = await chatService.postChatroomSend({ message })
    setChatData((prev) => [
      ...(prev || []),
      {
        messageId: data?.messageId,
        content: message,
        createdAt: new Date().toISOString(),
        senderType: ChatRoomMessageDataSenderTypeEnum.User,
      },
    ])
  }

  useChatSSE({
    onChatResponse: (chunk) => {
      console.log('Received chunk:', chunk)
      setChatData((prev) => {
        const lastMessage = prev?.[prev.length - 1]

        // 마지막 메시지가 스트리밍 중인 Assistant 메시지인지 확인
        if (
          lastMessage &&
          lastMessage.senderType === ChatRoomMessageDataSenderTypeEnum.Assistant &&
          !lastMessage.messageId
        ) {
          // 있다면, 기존 메시지 내용에 새로운 청크를 추가
          const updatedMessage = {
            ...lastMessage,
            content: (lastMessage.content || '') + chunk,
          }
          return [...prev!.slice(0, -1), updatedMessage]
        } else {
          // 스트리밍 시작: 새로운 Assistant 메시지 객체를 생성하여 추가
          const newAssistantMessage: ChatRoomMessageData = {
            messageId: new Date().getTime(),
            content: chunk,
            createdAt: new Date().toISOString(),
            senderType: ChatRoomMessageDataSenderTypeEnum.Assistant,
          }
          return [...(prev || []), newAssistantMessage]
        }
      })
    },
    onResponseId: (messageId) => {
      console.log('Received message ID:', messageId)
      // 응답 완료 후 메시지 ID를 받아 상태를 업데이트하는 액션 호출
      setChatData((prev) => {
        if (!prev) return []

        // messageId가 null인 마지막 Assistant 메시지를 찾아 실제 ID로 업데이트
        return prev.map((msg) => {
          if (msg.senderType === ChatRoomMessageDataSenderTypeEnum.Assistant && msg.messageId === null) {
            return { ...msg, messageId: Number(messageId) }
          }
          return msg
        })
      })
    },
    onLevelFinished: () => {
      // 다음 레벨로 업그레이드하는 API를 호출하는 액션
      fetchChatUpgrade()
    },
    onChatPaused: () => {
      // 채팅방을 PAUSED 상태로 변경하는 액션 호출
      setChatRoomState(ChatRoomStateDataChatRoomStateEnum.Paused)
      connectedRequired()
    },
    onError: (error) => {
      console.error('SSE Error:', error)
      // 필요 시 에러 처리 로직 (예: 사용자에게 에러 알림 표시)
    },
  })

  useEffect(() => {
    async function fetchChatStatus() {
      const { data: status } = await chatService.getChatroomStatus()
      setChatRoomState(status?.chatRoomState)

      if (status?.chatRoomState === ChatRoomStateDataChatRoomStateEnum.NeedNextQuestion) {
        await fetchChatUpgrade()
      }

      const { data: chatData } = await chatService.getCurrentChatRoomMessages()
      setChatData(chatData?.data?.list?.reverse() ?? [])

      if (status?.chatRoomState === ChatRoomStateDataChatRoomStateEnum.Paused) {
        connectedRequired()
      }
    }

    fetchChatStatus()
  }, [])

  const connectedRequired = () => {
    const createAssistantMessage = (lastMessage: ChatRoomMessageData) => ({
      content: CONNECTED_REQUIRED_MESSAGE,
      createdAt: lastMessage.createdAt,
      senderType: ChatRoomMessageDataSenderTypeEnum.Assistant,
    })

    setChatData((prev) => {
      if (!prev || prev.length === 0) {
        return prev
      }

      const lastMessage = prev[prev.length - 1]
      return [...prev, createAssistantMessage(lastMessage!)]
    })
  }

  async function fetchChatUpgrade() {
    if (chatRoomState === ChatRoomStateDataChatRoomStateEnum.NeedNextQuestion) {
      const { data } = await chatService.postChatroomUpgrade()
      console.log('Chat room upgraded:', data)
    }
    fetchChatUpgrade()
  }

  const exitButton = useCallback(() => {
    const actived = chatData && chatData?.length > 0

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
  }, [chatData])

  return (
    <ChattingContext.Provider
      value={{
        chatData,
        exitButton,
        chattingModal,
        sendMessage,
        chatRoomState,
      }}
    >
      {children}
    </ChattingContext.Provider>
  )
}

// 커스텀 훅
export function useChatting() {
  const context = useContext(ChattingContext)
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider')
  }
  return context
}
