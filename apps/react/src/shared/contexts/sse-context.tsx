import { createContext, useContext, ReactNode, useCallback, useRef, useEffect } from 'react'

import { useAuth } from '@/features/auth'
import { useSSE, SSEEventHandlers, UseSSEReturn } from '@/shared/hooks/use-sse'

// Context 타입에 disconnect 추가
interface SSEContextType extends UseSSEReturn {
  subscribe: (id: string, handlers: SSEEventHandlers) => () => void
}

const SSEContext = createContext<SSEContextType | undefined>(undefined)

export function SSEProvider({ children }: { children: ReactNode }) {
  const { authenticated } = useAuth()
  const subscribersRef = useRef<Map<string, SSEEventHandlers>>(new Map())

  const subscribe = useCallback((id: string, handlers: SSEEventHandlers) => {
    subscribersRef.current.set(id, handlers)
    return () => {
      subscribersRef.current.delete(id)
    }
  }, [])

  const createCombinedHandlers = (): SSEEventHandlers => {
    return {
      onChatResponse: (chunk: string) => subscribersRef.current.forEach((s) => s.onChatResponse?.(chunk)),
      onResponseId: (messageId: string) => subscribersRef.current.forEach((s) => s.onResponseId?.(messageId)),
      onLevelFinished: () => subscribersRef.current.forEach((s) => s.onLevelFinished?.()),
      onChatPaused: () => subscribersRef.current.forEach((s) => s.onChatPaused?.()),
      onCoupleConnected: () => subscribersRef.current.forEach((s) => s.onCoupleConnected?.()),
      onCoupleDisconnected: () => subscribersRef.current.forEach((s) => s.onCoupleDisconnected?.()),
      onError: (error: unknown) => subscribersRef.current.forEach((s) => s.onError?.(error)),
      onOpen: () => subscribersRef.current.forEach((s) => s.onOpen?.()),
    }
  }

  const { reconnect, disconnect } = useSSE(createCombinedHandlers(), authenticated)

  return <SSEContext.Provider value={{ subscribe, reconnect, disconnect }}>{children}</SSEContext.Provider>
}

// 훅이 { reconnect, disconnect } 객체를 반환하도록 수정
export function useSSESubscription(id: string, handlers: SSEEventHandlers): UseSSEReturn {
  const context = useContext(SSEContext)
  if (context === undefined) {
    throw new Error('useSSESubscription must be used within an SSEProvider')
  }

  const { subscribe, reconnect, disconnect } = context
  const handlersRef = useRef(handlers)

  useEffect(() => {
    handlersRef.current = handlers
  }, [handlers])

  useEffect(() => {
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

  return { reconnect, disconnect }
}
