import { createContext, useContext, ReactNode, useCallback, useRef, useEffect } from 'react'

import { useAuth } from '@/features/auth'
import { useSSE, SSEEventHandlers } from '@/shared/hooks/use-sse'

interface SSEContextType {
  subscribe: (id: string, handlers: SSEEventHandlers) => () => void
  reconnect: () => Promise<void>
}

const SSEContext = createContext<SSEContextType | undefined>(undefined)

export function SSEProvider({ children }: { children: ReactNode }) {
  const { authenticated } = useAuth()
  const subscribersRef = useRef<Map<string, SSEEventHandlers>>(new Map())

  // 구독 함수
  const subscribe = useCallback((id: string, handlers: SSEEventHandlers) => {
    subscribersRef.current.set(id, handlers)

    // 구독 해제 함수 반환
    return () => {
      subscribersRef.current.delete(id)
    }
  }, [])

  // 통합 핸들러 생성
  const createCombinedHandlers = useCallback((): SSEEventHandlers => {
    return {
      onChatResponse: (chunk: string) => {
        const subscribers = Array.from(subscribersRef.current.values())
        subscribers.forEach((s) => s.onChatResponse?.(chunk))
      },
      onResponseId: (messageId: string) => {
        const subscribers = Array.from(subscribersRef.current.values())
        subscribers.forEach((s) => s.onResponseId?.(messageId))
      },
      onLevelFinished: () => {
        const subscribers = Array.from(subscribersRef.current.values())
        subscribers.forEach((s) => s.onLevelFinished?.())
      },
      onChatPaused: () => {
        const subscribers = Array.from(subscribersRef.current.values())
        subscribers.forEach((s) => s.onChatPaused?.())
      },
      onCoupleConnected: () => {
        const subscribers = Array.from(subscribersRef.current.values())
        subscribers.forEach((s) => s.onCoupleConnected?.())
      },
      onCoupleDisconnected: () => {
        const subscribers = Array.from(subscribersRef.current.values())
        subscribers.forEach((s) => s.onCoupleDisconnected?.())
      },
      onError: (error: unknown) => {
        const subscribers = Array.from(subscribersRef.current.values())
        subscribers.forEach((s) => s.onError?.(error))
      },
      onOpen: () => {
        const subscribers = Array.from(subscribersRef.current.values())
        subscribers.forEach((s) => s.onOpen?.())
      },
    }
  }, [])

  // SSE 훅 사용
  const { reconnect } = useSSE(createCombinedHandlers(), authenticated)

  return <SSEContext.Provider value={{ subscribe, reconnect }}>{children}</SSEContext.Provider>
}

// SSE 구독을 위한 훅
export function useSSESubscription(id: string, handlers: SSEEventHandlers) {
  const context = useContext(SSEContext)
  if (context === undefined) {
    throw new Error('useSSESubscription must be used within an SSEProvider')
  }

  const { subscribe, reconnect } = context
  const handlersRef = useRef(handlers)

  useEffect(() => {
    handlersRef.current = handlers
  }, [handlers])

  useEffect(() => {
    // 핸들러 프록시 생성
    const stableHandlers: SSEEventHandlers = {
      onChatResponse: (chunk: string) => handlersRef.current.onChatResponse?.(chunk),
      onResponseId: (messageId: string) => handlersRef.current.onResponseId?.(messageId),
      onLevelFinished: () => handlersRef.current.onLevelFinished?.(),
      onChatPaused: () => handlersRef.current.onChatPaused?.(),
      onCoupleConnected: () => handlersRef.current.onCoupleConnected?.(),
      onCoupleDisconnected: () => handlersRef.current.onCoupleDisconnected?.(),
      onError: (error: unknown) => handlersRef.current.onError?.(error),
      onOpen: () => handlersRef.current.onOpen?.(),
    }

    const unsubscribe = subscribe(id, stableHandlers)
    return () => unsubscribe()
  }, [id, subscribe])

  return reconnect
}
