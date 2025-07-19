import { useNavigate } from '@tanstack/react-router'
import { cn } from '@ui/common/lib/utils'
import { createContext, useContext, useState, ReactNode, useCallback } from 'react'
import { useChattingModal } from '../hook/use-chatting-modal'

interface ChattingData {
  chat: { id: number; message: string; sendType: 'ai' | 'me'; timestamp: string }[]
}

interface ChattingContextType {
  data: ChattingData
  exitButton: () => ReactNode
}

// 기본값 설정
const defaultChattingData: ChattingData = {
  chat: [
    {
      id: 1,
      message:
        'OO아 안녕! 나는 연애 갈등 상담사 모모야. 나와의 대화를 마무리하고 싶다면 종료하기 버튼을 눌러줘! 오늘은 어떤 고민 때문에 나를 찾아왔어? 먼저 연인과 있었던 갈등 상황을 이야기해주면 내가 같이 고민해볼게!',
      sendType: 'ai',
      timestamp: '2023-10-01T21:56:00Z',
    },
    {
      id: 2,
      message: '같이 있으면 좋은데, 마음을 표현하는 방식이 너무 달라.. 나만 노력하고 있는 느낌이 들 때가 있어서 속상해',
      sendType: 'me',
      timestamp: '2023-10-01T21:58:00Z',
    },
    {
      id: 3,
      message:
        '아, 그런 상황이구나. 연인과의 마음 표현 방식이 다르면 갈등이 생길 수 있어. 그 사람 마음을 해석하고, 어떻게 하면 좋을지 알려줄게.',
      sendType: 'ai',
      timestamp: '2023-10-03T09:30:00Z',
    },
    {
      id: 4,
      message: '네 말이 맞아. 내가 너무 내 생각만 했나봐.',
      sendType: 'me',
      timestamp: '2023-10-03T09:32:00Z',
    },
  ],
}

// 컨텍스트 생성
const ChattingContext = createContext<ChattingContextType | undefined>(undefined)

// 컨텍스트 프로바이더 컴포넌트
export function ChattingProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<ChattingData>(defaultChattingData)
  const navigate = useNavigate()

  const exitButton = useCallback(() => {
    const actived = data.chat.length > 0

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
  }, [])

  return (
    <ChattingContext.Provider
      value={{
        data,
        exitButton,
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
