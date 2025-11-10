import { EventSourcePolyfill, NativeEventSource } from 'event-source-polyfill'
import { useCallback, useEffect, useRef } from 'react'

import bridge from '@/shared/bridge'
import { isWebView } from '@/shared/utils/webview'

const rawApiHost = import.meta.env.PROD ? import.meta.env.VITE_API_URL : '/api'
const API_HOST = rawApiHost.replace(/\/+$/, '')
const EventSourceImpl = EventSourcePolyfill || (NativeEventSource as typeof EventSourcePolyfill)

export interface SSEEventHandlers {
  onChatResponse?: (chunk: string) => void
  onResponseId?: (messageId: string) => void
  onLevelFinished?: () => void
  onChatPaused?: () => void
  onCoupleConnected?: () => void
  onCoupleDisconnected?: () => void
  onError?: (error: unknown) => void
  onOpen?: () => void
}

type ConnectionStatus = 'CONNECTING' | 'OPEN' | 'CLOSED'

const BACKOFF_STEPS = [1000, 2000, 5000, 10000] as const
const HEARTBEAT_TIMEOUT = 60_000

export interface UseSSEReturn {
  reconnect: () => Promise<void>
  disconnect: () => void
}

export const useSSE = (handlers: SSEEventHandlers, enabled: boolean = true): UseSSEReturn => {
  const esRef = useRef<EventSourcePolyfill | null>(null)
  const statusRef = useRef<ConnectionStatus>('CLOSED')
  const handlersRef = useRef(handlers)
  const reconnectAttemptRef = useRef(0)
  const closingRef = useRef(false)

  useEffect(() => {
    handlersRef.current = handlers
  }, [handlers])

  const devLog = (...args: unknown[]) => {
    if (import.meta.env.DEV) console.log(...args)
  }

  const closeConnection = useCallback(() => {
    if (esRef.current) {
      esRef.current.close()
      esRef.current = null
    }
    statusRef.current = 'CLOSED'
    devLog('[SSE] Connection closed')
  }, [])

  const delayWithJitter = (ms: number) => {
    const jitter = ms * 0.2 * Math.random()
    return new Promise((r) => setTimeout(r, ms + jitter))
  }

  // 1. connect 함수가 401 발생 시 명시적으로 에러를 throw 하도록 수정
  const connect = useCallback((): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!enabled || statusRef.current === 'OPEN' || statusRef.current === 'CONNECTING' || closingRef.current) {
        return resolve()
      }
      statusRef.current = 'CONNECTING'

      const doConnect = async () => {
        try {
          const accessToken = isWebView()
            ? (await bridge.getAuthToken()).accessToken
            : localStorage.getItem('accessToken')
          if (!accessToken) throw new Error('Access token is missing')

          const sse = new EventSourceImpl(`${API_HOST}/sse/connect`, {
            headers: { Authorization: `Bearer ${accessToken}` },
            heartbeatTimeout: HEARTBEAT_TIMEOUT,
            withCredentials: true,
          })
          esRef.current = sse

          sse.onopen = () => {
            devLog('[SSE] Connection opened')
            statusRef.current = 'OPEN'
            reconnectAttemptRef.current = 0
            handlersRef.current.onOpen?.()
            resolve()
          }

          const createListener = (handler?: (data: string) => void) => (event: unknown) => {
            const { data } = event as MessageEvent
            if (typeof data !== 'undefined') {
              handler?.(data as string)
            }
          }

          sse.addEventListener('chat_response', createListener(handlersRef.current.onChatResponse))
          sse.addEventListener('ai_response_id', createListener(handlersRef.current.onResponseId))
          sse.addEventListener('current_level_finished', createListener(handlersRef.current.onLevelFinished))
          sse.addEventListener('chat_room_paused', createListener(handlersRef.current.onChatPaused))
          sse.addEventListener('couple_connected', createListener(handlersRef.current.onCoupleConnected))
          sse.addEventListener('couple_disconnected', createListener(handlersRef.current.onCoupleDisconnected))

          sse.onerror = (error) => {
            devLog('[SSE] Error', error)
            closeConnection()
            handlersRef.current.onError?.(error)

            const status = (error as { status?: number }).status
            if (status === 401) {
              reject(new Error('401 Unauthorized')) // 401 에러 발생 시 Promise reject
            } else {
              void safeReconnect() // 다른 에러는 기존대로 자동 재연결 시도
            }
          }
        } catch (err) {
          devLog('[SSE] Connect exception', err)
          statusRef.current = 'CLOSED'
          handlersRef.current.onError?.(err)
          reject(err)
        }
      }
      void doConnect()
    })
  }, [enabled, closeConnection])

  const safeReconnect = useCallback(async () => {
    if (closingRef.current) return
    const attempt = reconnectAttemptRef.current
    const wait = BACKOFF_STEPS[Math.min(attempt, BACKOFF_STEPS.length - 1)] ?? 1000
    reconnectAttemptRef.current = attempt + 1
    devLog(`[SSE] Reconnect attempt #${attempt + 1} in ${wait}ms`)
    await delayWithJitter(wait)
    await connect()
  }, [connect])

  // 2. 토큰 갱신만 책임지는 별도 함수 생성
  const refreshToken = useCallback(async () => {
    devLog('[SSE] Refreshing token via bridge')
    if (isWebView()) {
      await bridge.notifyTokenExpired()
    }
  }, [])

  // 3. reconnect 함수가 401 에러를 잡아서 토큰 갱신 후 재시도하도록 수정
  const reconnect = useCallback(async () => {
    devLog('[SSE] Manual reconnect triggered')
    closeConnection()
    reconnectAttemptRef.current = 0
    try {
      await connect()
    } catch (error: any) {
      if (error.message.includes('401')) {
        devLog('[SSE] Reconnect failed with 401, refreshing token and retrying...')
        await refreshToken()
        await connect() // 토큰 갱신 후 다시 연결 시도
      } else {
        throw error // 401이 아닌 다른 에러는 그대로 throw
      }
    }
  }, [closeConnection, connect, refreshToken])

  useEffect(() => {
    if (enabled) {
      closingRef.current = false
      void connect().catch(() => {})
    }
    return () => {
      closingRef.current = true
      closeConnection()
    }
  }, [enabled, connect, closeConnection])

  return { reconnect, disconnect: closeConnection }
}
