import { useSSESubscription } from '@/shared/contexts/sse-context'
import { SSEEventHandlers } from '@/shared/hooks/use-sse'

export interface UseChatSSEReturn {
  reconnect: () => Promise<void>
}

export interface ChatSSEHandlers {
  onChatResponse?: (chunk: string) => void
  onResponseId?: (messageId: string) => void
  onLevelFinished?: () => void
  onChatPaused?: () => void
  onError?: (error: unknown) => void
}

export function useChatSSE(handlers: ChatSSEHandlers, enabled: boolean = true): UseChatSSEReturn {
  // 채팅 관련 이벤트만 처리하는 핸들러 생성
  const chatHandlers: SSEEventHandlers = {
    onChatResponse: enabled ? handlers.onChatResponse : undefined,
    onResponseId: enabled ? handlers.onResponseId : undefined,
    onLevelFinished: enabled ? handlers.onLevelFinished : undefined,
    onChatPaused: enabled ? handlers.onChatPaused : undefined,
    onError: enabled ? handlers.onError : undefined,
  }

  // 통합 SSE에 구독
  const reconnect = useSSESubscription('chat', chatHandlers)

  return { reconnect }
}
