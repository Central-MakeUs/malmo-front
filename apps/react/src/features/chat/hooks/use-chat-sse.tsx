import { EventSourcePolyfill, NativeEventSource } from 'event-source-polyfill'
import { useEffect, useRef } from 'react'

import bridge from '@/shared/bridge'

const API_HOST = import.meta.env.PROD ? import.meta.env.VITE_API_URL : '/api'
const EventSourceImpl = EventSourcePolyfill || (NativeEventSource as typeof EventSourcePolyfill)

interface ChatSSECallbacks {
  onChatResponse: (chunk: string) => void
  onResponseId: (messageId: string) => void
  onLevelFinished: () => void
  onChatPaused: () => void
  onError?: (error: unknown) => void
  onOpen?: () => void
}

const BACKOFF_STEPS = [1000, 2000, 5000, 10000] as const
const INACTIVITY_MS = 55_000 // 서버 60s 타임아웃 대비 선제 재연결
const HEARTBEAT_TIMEOUT = 65_000 // 폴리필 연결 정지 감지 시간

export const useChatSSE = (callbacks: ChatSSECallbacks, enabled: boolean) => {
  const esRef = useRef<EventSourcePolyfill | null>(null)
  const callbacksRef = useRef(callbacks)
  const reconnectAttemptRef = useRef(0)
  const inactivityTimerRef = useRef<number | null>(null)
  const closingRef = useRef(false)

  // 최신 콜백 유지
  useEffect(() => {
    callbacksRef.current = callbacks
  }, [callbacks])

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
  const armInactivityTimer = () => {
    clearInactivityTimer()
    inactivityTimerRef.current = window.setTimeout(() => {
      devLog('[SSE] Inactivity → reconnect')
      void safeReconnect()
    }, INACTIVITY_MS)
  }

  // 안전 종료
  const closeES = () => {
    clearInactivityTimer()
    if (esRef.current) {
      try {
        esRef.current.close()
      } catch {}
      esRef.current = null
    }
  }

  const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

  // 401 처리: refresh → 즉시 재연결
  const handle401AndReconnect = async () => {
    try {
      devLog('[SSE] 401 → refresh token')
      await bridge.notifyTokenExpired() // storage의 토큰 갱신(실제 재발급 로직 포함)
      devLog('[SSE] refresh ok → reconnect now')
      reconnectAttemptRef.current = 0
      await connect() // 새 토큰으로 새 연결
    } catch (err) {
      callbacksRef.current.onError?.(err ?? new Error('Token refresh failed'))
      bridge.onAuthExpired?.()
    }
  }

  // 백오프 재연결
  const safeReconnect = async () => {
    closeES()
    if (closingRef.current) return
    const attempt = reconnectAttemptRef.current
    const wait = BACKOFF_STEPS[Math.min(attempt, BACKOFF_STEPS.length - 1)]
    reconnectAttemptRef.current = attempt + 1
    devLog(`[SSE] reconnect #${attempt + 1} in ${wait}ms`)
    await delay(wait ?? 10000)
    await connect()
  }

  // 실제 연결
  const connect = async (): Promise<void> => {
    if (!enabled || esRef.current) return

    try {
      const { accessToken } = await bridge.getAuthToken()
      if (!accessToken) {
        callbacksRef.current.onError?.(new Error('Access token is missing'))
        return
      }

      const sse = new EventSourceImpl(`${API_HOST}/sse/connect`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        heartbeatTimeout: HEARTBEAT_TIMEOUT,
      })
      esRef.current = sse

      sse.onopen = () => {
        devLog('[SSE] open')
        reconnectAttemptRef.current = 0
        callbacksRef.current.onOpen?.()
        armInactivityTimer()
      }

      // 메시지 핸들러
      const onMessage = (e: MessageEvent<string>) => {
        armInactivityTimer()
        callbacksRef.current.onChatResponse(e.data)
      }
      const onId = (e: MessageEvent<string>) => {
        armInactivityTimer()
        callbacksRef.current.onResponseId(e.data)
      }
      const onFinish = () => {
        armInactivityTimer()
        callbacksRef.current.onLevelFinished()
      }
      const onPaused = () => {
        armInactivityTimer()
        callbacksRef.current.onChatPaused()
      }

      // 래퍼로 커스텀 이벤트 리스너 타입 충돌 해결 (polyfill EventListener 시그니처 차이)
      const addCustomListener = (type: string, listener: (e: MessageEvent<string>) => void) => {
        sse.addEventListener(type, (ev) => listener(ev as MessageEvent<string>))
      }

      addCustomListener('chat_response', onMessage)
      addCustomListener('ai_response_id', onId)
      addCustomListener('current_level_finished', onFinish)
      addCustomListener('chat_room_paused', onPaused)

      sse.onerror = (ev) => {
        devLog('[SSE] error', ev)
        clearInactivityTimer()

        // ✅ fetch 인터셉터에서 던진 401 에러도 여기로 들어올 수 있음
        const status = (ev as { status?: number }).status
        if (status === 401) {
          closeES()
          void handle401AndReconnect()
          return
        }

        // 그 외 네트워크/타임아웃: 백오프 재연결
        closeES()
        void safeReconnect()
      }
    } catch (err) {
      devLog('[SSE] connect exception', err)
      callbacksRef.current.onError?.(err)
      await safeReconnect()
    }
  }

  // 생명주기
  useEffect(() => {
    if (!enabled) {
      closingRef.current = true
      closeES()
      closingRef.current = false
      return
    }
    void connect()
    return () => {
      closingRef.current = true
      closeES()
      closingRef.current = false
      devLog('[SSE] unmounted/disabled → closed')
    }
  }, [enabled])
}
