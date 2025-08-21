import { EventSourcePolyfill, NativeEventSource } from 'event-source-polyfill'
import { useCallback, useEffect, useRef } from 'react'

import bridge from '@/shared/bridge'
import { isWebView } from '@/shared/utils/webview'

const API_HOST = import.meta.env.PROD ? import.meta.env.VITE_API_URL : '/api'
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
const HEARTBEAT_TIMEOUT = 60_000 // 60초 동안 아무런 신호(Heartbeat 포함)가 없으면 라이브러리가 onerror를 발생시킴

export interface UseSSEReturn {
  reconnect: () => Promise<void>
}

export const useSSE = (handlers: SSEEventHandlers, enabled: boolean = true): UseSSEReturn => {
  const esRef = useRef<EventSourcePolyfill | null>(null)
  const statusRef = useRef<ConnectionStatus>('CLOSED')
  const handlersRef = useRef(handlers)
  const reconnectAttemptRef = useRef(0)
  const closingRef = useRef(false) // 컴포넌트 unmount 시 재연결 방지 플래그

  useEffect(() => {
    handlersRef.current = handlers
  }, [handlers])

  const devLog = (...args: unknown[]) => {
    if (import.meta.env.DEV) console.log(...args)
  }

  // 연결 종료 함수
  const closeConnection = useCallback(() => {
    if (esRef.current) {
      esRef.current.close()
      esRef.current = null
    }
    statusRef.current = 'CLOSED'
  }, [])

  // 재연결 시도 간격에 무작위성을 더하는 함수 (서버 부하 분산)
  const delayWithJitter = (ms: number) => {
    const jitter = ms * 0.2 * Math.random()
    return new Promise((r) => setTimeout(r, ms + jitter))
  }

  // SSE 연결 함수
  const connect = useCallback(async (): Promise<void> => {
    if (!enabled || statusRef.current === 'OPEN' || statusRef.current === 'CONNECTING' || closingRef.current) {
      return
    }
    statusRef.current = 'CONNECTING'

    try {
      const accessToken = isWebView() ? (await bridge.getAuthToken()).accessToken : localStorage.getItem('accessToken')

      if (!accessToken) throw new Error('Access token is missing')

      const sse = new EventSourceImpl(`${API_HOST}/sse/connect`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        heartbeatTimeout: HEARTBEAT_TIMEOUT,
      })
      esRef.current = sse

      sse.onopen = () => {
        devLog('[SSE] open')
        statusRef.current = 'OPEN'
        reconnectAttemptRef.current = 0
        handlersRef.current.onOpen?.()
      }

      const createListener = (handler?: (data: string) => void) => (event: any) => {
        if (typeof event.data !== 'undefined') {
          handler?.(event.data)
        }
      }

      sse.addEventListener('chat_response', createListener(handlersRef.current.onChatResponse))
      sse.addEventListener('ai_response_id', createListener(handlersRef.current.onResponseId))
      sse.addEventListener('current_level_finished', createListener(handlersRef.current.onLevelFinished))
      sse.addEventListener('chat_room_paused', createListener(handlersRef.current.onChatPaused))
      sse.addEventListener('couple_connected', createListener(handlersRef.current.onCoupleConnected))
      sse.addEventListener('couple_disconnected', createListener(handlersRef.current.onCoupleDisconnected))

      sse.onerror = (error) => {
        devLog('[SSE] error', error)
        closeConnection()
        const status = (error as { status?: number }).status
        if (status === 401) {
          void handle401AndReconnect()
        } else {
          void safeReconnect()
        }
      }
    } catch (err) {
      devLog('[SSE] connect exception', err)
      statusRef.current = 'CLOSED'
      handlersRef.current.onError?.(err)
      void safeReconnect()
    }
  }, [enabled, closeConnection])

  // 안전한 재연결 시도 함수
  const safeReconnect = useCallback(async () => {
    if (closingRef.current) return
    const attempt = reconnectAttemptRef.current
    const wait = BACKOFF_STEPS[Math.min(attempt, BACKOFF_STEPS.length - 1)] ?? 1000
    reconnectAttemptRef.current = attempt + 1
    devLog(`[SSE] reconnect #${attempt + 1} in ${wait}ms`)
    await delayWithJitter(wait)
    await connect()
  }, [connect])

  // 401 에러(인증 실패) 시 토큰 갱신 후 재연결
  const handle401AndReconnect = useCallback(async () => {
    try {
      devLog('[SSE] 401 → refresh token')
      if (isWebView()) await bridge.notifyTokenExpired()

      devLog('[SSE] refresh ok → reconnect now')
      reconnectAttemptRef.current = 0
      await connect()
    } catch (err) {
      handlersRef.current.onError?.(err)
    }
  }, [connect])

  // 외부에서 수동으로 재연결을 요청할 때 사용하는 함수
  const reconnect = useCallback(async () => {
    if (statusRef.current === 'OPEN' || statusRef.current === 'CONNECTING') {
      devLog('[SSE] Manual reconnect skipped: already open or connecting')
      return
    }
    devLog('[SSE] Manual reconnect triggered')
    closeConnection()
    reconnectAttemptRef.current = 0
    await connect()
  }, [closeConnection, connect])

  // 컴포넌트 마운트/언마운트 시 SSE 연결/해제 관리
  useEffect(() => {
    if (enabled) {
      closingRef.current = false
      void connect()
    }
    return () => {
      closingRef.current = true
      closeConnection()
      devLog('[SSE] unmounted/disabled → closed')
    }
  }, [enabled, connect, closeConnection])

  return { reconnect }
}
