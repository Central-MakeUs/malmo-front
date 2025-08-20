import { EventSourcePolyfill, NativeEventSource } from 'event-source-polyfill'
import { useCallback, useEffect, useRef } from 'react'

import bridge from '@/shared/bridge'
import { isWebView } from '@/shared/utils/webview'

const API_HOST = import.meta.env.PROD ? import.meta.env.VITE_API_URL : '/api'
const EventSourceImpl = EventSourcePolyfill || (NativeEventSource as typeof EventSourcePolyfill)

// SSE 이벤트 핸들러 인터페이스
export interface SSEEventHandlers {
  // 채팅 이벤트
  onChatResponse?: (chunk: string) => void
  onResponseId?: (messageId: string) => void
  onLevelFinished?: () => void
  onChatPaused?: () => void

  // 커플 상태 이벤트
  onCoupleConnected?: () => void
  onCoupleDisconnected?: () => void

  // 공통 이벤트
  onError?: (error: unknown) => void
  onOpen?: () => void
}

const BACKOFF_STEPS = [1000, 2000, 5000, 10000] as const
const INACTIVITY_MS = 50_000 // 서버 60s 타임아웃 대비 선제 재연결
const HEARTBEAT_TIMEOUT = 65_000 // 폴리필 연결 정지 감지 시간

export interface UseSSEReturn {
  reconnect: () => Promise<void>
}

export const useSSE = (handlers: SSEEventHandlers, enabled: boolean = true): UseSSEReturn => {
  const esRef = useRef<EventSourcePolyfill | null>(null)
  const handlersRef = useRef(handlers)
  const reconnectAttemptRef = useRef(0)
  const inactivityTimerRef = useRef<number | null>(null)
  const closingRef = useRef(false)

  // 최신 핸들러 유지
  useEffect(() => {
    handlersRef.current = handlers
  }, [handlers])

  const devLog = (...args: unknown[]) => {
    if (import.meta.env.DEV) console.log(...args)
  }

  // 타이머 유틸
  const clearInactivityTimer = () => {
    if (inactivityTimerRef.current) {
      window.clearTimeout(inactivityTimerRef.current)
      inactivityTimerRef.current = null
    }
  }

  const armInactivityTimer = useCallback(() => {
    clearInactivityTimer()
    inactivityTimerRef.current = window.setTimeout(() => {
      devLog('[SSE] Inactivity → reconnect')
      void safeReconnect()
    }, INACTIVITY_MS)
  }, [])

  // 연결 종료
  const closeConnection = useCallback(() => {
    clearInactivityTimer()
    if (esRef.current) {
      esRef.current.close()
      esRef.current = null
    }
  }, [])

  const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

  const connect = useCallback(async (): Promise<void> => {
    if (!enabled || esRef.current || closingRef.current) return

    try {
      let accessToken: string | null = null
      if (isWebView()) {
        accessToken = (await bridge.getAuthToken()).accessToken
      } else {
        accessToken = localStorage.getItem('accessToken')
      }

      if (!accessToken) {
        throw new Error('Access token is missing')
      }

      const sse = new EventSourceImpl(`${API_HOST}/sse/connect`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        heartbeatTimeout: HEARTBEAT_TIMEOUT,
      })
      esRef.current = sse

      sse.onopen = () => {
        devLog('[SSE] open')
        reconnectAttemptRef.current = 0
        handlersRef.current.onOpen?.()
        armInactivityTimer()
      }

      const addCustomListener = (type: string, listener: (e: MessageEvent<string>) => void) => {
        sse.addEventListener(type, (ev) => listener(ev as MessageEvent<string>))
      }

      // 이벤트 핸들러 등록
      const onMessage = (e: MessageEvent<string>) => {
        armInactivityTimer()
        handlersRef.current.onChatResponse?.(e.data)
      }
      const onId = (e: MessageEvent<string>) => {
        armInactivityTimer()
        handlersRef.current.onResponseId?.(e.data)
      }
      const onFinish = () => {
        armInactivityTimer()
        handlersRef.current.onLevelFinished?.()
      }
      const onPaused = () => {
        armInactivityTimer()
        handlersRef.current.onChatPaused?.()
      }
      const onCoupleConnected = () => {
        armInactivityTimer()
        handlersRef.current.onCoupleConnected?.()
      }
      const onCoupleDisconnected = () => {
        armInactivityTimer()
        handlersRef.current.onCoupleDisconnected?.()
      }

      addCustomListener('chat_response', onMessage)
      addCustomListener('ai_response_id', onId)
      addCustomListener('current_level_finished', onFinish)
      addCustomListener('chat_room_paused', onPaused)
      addCustomListener('couple_connected', onCoupleConnected)
      addCustomListener('couple_disconnected', onCoupleDisconnected)

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
      handlersRef.current.onError?.(err)
      void safeReconnect()
    }
  }, [enabled, closeConnection, armInactivityTimer])

  const safeReconnect = useCallback(async () => {
    if (closingRef.current) return
    const attempt = reconnectAttemptRef.current
    const wait = BACKOFF_STEPS[Math.min(attempt, BACKOFF_STEPS.length - 1)] ?? 1000
    reconnectAttemptRef.current = attempt + 1
    devLog(`[SSE] reconnect #${attempt + 1} in ${wait}ms`)
    await delay(wait)
    await connect()
  }, [connect])

  const handle401AndReconnect = useCallback(async () => {
    try {
      devLog('[SSE] 401 → refresh token')
      if (isWebView()) await bridge.notifyTokenExpired()
      // 웹 환경 토큰 갱신 로직 추가 필요

      devLog('[SSE] refresh ok → reconnect now')
      reconnectAttemptRef.current = 0
      await connect()
    } catch (err) {
      handlersRef.current.onError?.(err)
    }
  }, [connect])

  const reconnect = useCallback(async () => {
    devLog('[SSE] Manual reconnect triggered')
    closeConnection()
    reconnectAttemptRef.current = 0
    await connect()
  }, [closeConnection, connect])

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
