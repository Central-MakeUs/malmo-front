import { useSSESubscription } from '@/shared/contexts/sse-context'
import { SSEEventHandlers } from '@/shared/hooks/use-sse'

export interface CoupleStatusSSEHandlers {
  onCoupleConnected?: () => void
  onCoupleDisconnected?: () => void
  onError?: (error: unknown) => void
}

export function useCoupleStatusSSE(handlers: CoupleStatusSSEHandlers, enabled: boolean = true): () => Promise<void> {
  // 커플 상태 관련 이벤트 핸들러
  const coupleHandlers: SSEEventHandlers = {
    onCoupleConnected: enabled ? handlers.onCoupleConnected : undefined,
    onCoupleDisconnected: enabled ? handlers.onCoupleDisconnected : undefined,
    onError: enabled ? handlers.onError : undefined,
  }

  // 통합 SSE에 구독
  const reconnect = useSSESubscription('couple-status', coupleHandlers)

  return reconnect
}
