import { useSSESubscription } from '@/shared/contexts/sse-context'
import { SSEEventHandlers } from '@/shared/hooks/use-sse'

export interface CoupleStatusSSEHandlers {
  onCoupleConnected?: () => void
  onCoupleDisconnected?: () => void
  onError?: (error: unknown) => void
}

export function useCoupleStatusSSE(handlers: CoupleStatusSSEHandlers, enabled: boolean = true) {
  const coupleHandlers: SSEEventHandlers = {
    onCoupleConnected: enabled ? handlers.onCoupleConnected : undefined,
    onCoupleDisconnected: enabled ? handlers.onCoupleDisconnected : undefined,
    onError: enabled ? handlers.onError : undefined,
  }

  // 통합 SSE 컨텍스트에 'couple-status'라는 ID로 구독
  useSSESubscription('couple-status', coupleHandlers)
}
