import { createContext, useContext, ReactNode, useCallback, useRef, useEffect } from 'react'

import { useAuth } from '@/features/auth'
import { useSSE, SSEEventHandlers, ConnectionStatus } from '@/shared/hooks/use-sse'

interface SSEContextType {
  subscribe: (id: string, handlers: SSEEventHandlers) => () => void
  reconnect: () => Promise<void>
  status: ConnectionStatus
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
      onChatResponse: (chunk: string) => {
        subscribersRef.current.forEach((s) => s.onChatResponse?.(chunk))
      },
      onResponseId: (messageId: string) => {
        subscribersRef.current.forEach((s) => s.onResponseId?.(messageId))
      },
      onLevelFinished: () => {
        subscribersRef.current.forEach((s) => s.onLevelFinished?.())
      },
      onChatPaused: () => {
        subscribersRef.current.forEach((s) => s.onChatPaused?.())
      },
      onCoupleConnected: () => {
        subscribersRef.current.forEach((s) => s.onCoupleConnected?.())
      },
      onCoupleDisconnected: () => {
        subscribersRef.current.forEach((s) => s.onCoupleDisconnected?.())
      },
      onError: (error: unknown) => {
        subscribersRef.current.forEach((s) => s.onError?.(error))
      },
      onOpen: () => {
        subscribersRef.current.forEach((s) => s.onOpen?.())
      },
    }
  }

  const { reconnect, status } = useSSE(createCombinedHandlers(), authenticated)

  return <SSEContext.Provider value={{ subscribe, reconnect, status }}>{children}</SSEContext.Provider>
}

export function useSSESubscription(id: string, handlers: SSEEventHandlers) {
  const context = useContext(SSEContext)
  if (context === undefined) {
    throw new Error('useSSESubscription must be used within an SSEProvider')
  }

  const { subscribe, reconnect, status } = context
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

  return { reconnect, status }
}
