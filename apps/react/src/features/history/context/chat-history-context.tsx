import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { GetChatRoomListResponse } from '@data/user-api-axios/api'
import historyService from '@/shared/services/history.service'

interface ChatHistoryContextType {
  chatHistory: GetChatRoomListResponse[]
}

// 컨텍스트 생성
const ChatHistoryContext = createContext<ChatHistoryContextType | undefined>(undefined)

// 컨텍스트 프로바이더 컴포넌트
export function ChatHistoryProvider({ children }: { children: ReactNode }) {
  const [chatHistory, setChatHistory] = useState<GetChatRoomListResponse[]>([])

  useEffect(() => {
    const fetchChatHistory = async () => {
      const { data } = await historyService.getHistoryList()

      if (data?.list) {
        setChatHistory(data.list)
      }
    }
    fetchChatHistory()
  }, [])

  return <ChatHistoryContext.Provider value={{ chatHistory }}>{children}</ChatHistoryContext.Provider>
}

// 커스텀 훅
export function useChatHistory() {
  const context = useContext(ChatHistoryContext)
  if (context === undefined) {
    throw new Error('useChatHistory must be used within a ChatHistoryProvider')
  }
  return context
}
