import { useNavigate } from '@tanstack/react-router'
import { cn } from '@ui/common/lib/utils'
import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react'
import { useChattingModal, UseChattingModalReturn } from '../hook/use-chatting-modal'
import chatService from '@/shared/services/chat.service'
import { ChatRoomMessageData } from '@data/user-api-axios/api'

interface ChattingContextType {
  chatData: ChatRoomMessageData[] | undefined
  exitButton: () => ReactNode
  chattingModal: UseChattingModalReturn
}

// 컨텍스트 생성
const ChattingContext = createContext<ChattingContextType | undefined>(undefined)

// 컨텍스트 프로바이더 컴포넌트
export function ChattingProvider({ children }: { children: ReactNode }) {
  const [chatData, setChatData] = useState<ChatRoomMessageData[] | undefined>(undefined)
  const chattingModal = useChattingModal()
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchChatData() {
      const { data } = await chatService.getCurrentChatRoomMessages()
      setChatData(data?.data?.list?.reverse() ?? [])
    }

    fetchChatData()
  }, [])

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
