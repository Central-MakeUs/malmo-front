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
      void reconnect()
    }, INACTIVITY_MS)
  }

  // 연결 종료
  const closeConnection = useCallback(() => {
    if (esRef.current) {
      closingRef.current = true
      clearInactivityTimer()
      esRef.current.close()
      esRef.current = null
    }
  }, [])

  // 재연결 함수
  const reconnect = useCallback(async (): Promise<void> => {
    if (closingRef.current) {
      return
    }

    closeConnection()

    try {
      let accessToken: string | null = null

      if (isWebView()) {
        const tokenData = await bridge.getAuthToken()
        accessToken = tokenData.accessToken
      } else {
        accessToken = localStorage.getItem('accessToken')
      }

      if (!accessToken) {
        return
      }

      const backoffMs = BACKOFF_STEPS[Math.min(reconnectAttemptRef.current, BACKOFF_STEPS.length - 1)]

      if (reconnectAttemptRef.current > 0) {
        await new Promise((resolve) => setTimeout(resolve, backoffMs))
      }

      const es = new EventSourceImpl(`${API_HOST}/sse/connect`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        heartbeatTimeout: HEARTBEAT_TIMEOUT,
      })

      es.onopen = () => {
        reconnectAttemptRef.current = 0
        armInactivityTimer()
        handlersRef.current.onOpen?.()
      }

      es.onerror = async (error) => {
        // 401 오류인 경우 토큰 갱신 시도 (웹뷰 환경에서만)
        if (error && typeof error === 'object' && 'status' in error && error.status === 401 && isWebView()) {
          try {
            const { accessToken: newAccessToken } = await bridge.notifyTokenExpired()
            if (newAccessToken) {
              // 현재 연결 완전히 종료 후 재연결
              closeConnection()
              // 잠시 후 재연결 (토큰 갱신 완료 후)
              setTimeout(() => {
                void reconnect()
              }, 1000)
              return
            }
          } catch {
            // 토큰 갱신 실패는 onError로 전달
          }
        }

        handlersRef.current.onError?.(error)
        reconnectAttemptRef.current++
        // 자동 재연결은 브라우저가 처리하므로 여기서는 로그만
      }

      // 채팅 이벤트 구독
      es.addEventListener('chat_response', (event) => {
        const messageEvent = event as MessageEvent
        armInactivityTimer()
        handlersRef.current.onChatResponse?.(messageEvent.data)
      })

      es.addEventListener('ai_response_id', (event) => {
        const messageEvent = event as MessageEvent
        armInactivityTimer()
        handlersRef.current.onResponseId?.(messageEvent.data)
      })

      es.addEventListener('current_level_finished', () => {
        armInactivityTimer()
        handlersRef.current.onLevelFinished?.()
      })

      es.addEventListener('chat_room_paused', () => {
        armInactivityTimer()
        handlersRef.current.onChatPaused?.()
      })

      // 커플 상태 이벤트 구독
      es.addEventListener('couple_connected', () => {
        armInactivityTimer()
        handlersRef.current.onCoupleConnected?.()
      })

      es.addEventListener('couple_disconnected', () => {
        armInactivityTimer()
        handlersRef.current.onCoupleDisconnected?.()
      })

      esRef.current = es
    } catch (error) {
      handlersRef.current.onError?.(error)
      reconnectAttemptRef.current++
      // 재시도
      const retryBackoff = BACKOFF_STEPS[Math.min(reconnectAttemptRef.current, BACKOFF_STEPS.length - 1)]
      setTimeout(() => void reconnect(), retryBackoff)
    }
  }, [closeConnection])

  // 초기 연결 및 정리
  useEffect(() => {
    if (enabled) {
      closingRef.current = false
      void reconnect()
    }

    return () => {
      closingRef.current = true
      closeConnection()
    }
  }, [enabled, reconnect, closeConnection])

  return { reconnect }
}
