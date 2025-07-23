import { useEffect, useRef } from 'react'
import { EventSourcePolyfill, NativeEventSource } from 'event-source-polyfill'
import bridge from '@/shared/bridge'

const API_HOST = '/api'
const EventSource = EventSourcePolyfill || NativeEventSource

interface ChatSSECallbacks {
  onChatResponse: (chunk: string) => void
  onResponseId: (messageId: string) => void
  onLevelFinished: () => void
  onChatPaused: () => void
  onError?: (error: any) => void
  onOpen?: () => void
}

export const useChatSSE = (callbacks: ChatSSECallbacks) => {
  const eventSourceRef = useRef<EventSourcePolyfill | null>(null)
  // 콜백 함수들을 저장하기 위한 ref를 생성합니다.
  const callbacksRef = useRef(callbacks)

  // 매 렌더링마다 ref에 최신 콜백 함수를 저장합니다.
  // 이 useEffect는 의존성 배열이 없으므로 렌더링될 때마다 실행됩니다.
  useEffect(() => {
    callbacksRef.current = callbacks
  })

  // 이 useEffect는 의존성 배열이 비어있어, 오직 컴포넌트가 마운트될 때 "한 번"만 실행됩니다.
  useEffect(() => {
    const connect = async () => {
      if (eventSourceRef.current) return

      try {
        const { accessToken } = await bridge.getAuthToken()
        if (!accessToken) {
          callbacksRef.current.onError?.(new Error('Access token is missing.'))
          return
        }

        const sse = new EventSource(`${API_HOST}/sse/connect`, {
          headers: { Authorization: `Bearer ${accessToken}` },
          heartbeatTimeout: 600000,
          withCredentials: true,
        })

        eventSourceRef.current = sse

        sse.onopen = () => {
          console.log('SSE connection opened.')
          callbacksRef.current.onOpen?.()
        }

        sse.onerror = (error: any) => {
          console.error('SSE Error:', error)
          callbacksRef.current.onError?.(error)
          if (error.status === 401) {
            console.error('SSE connection failed with 401 Unauthorized. Closing connection.')
            sse.close()
            eventSourceRef.current = null
          }
        }

        // 모든 이벤트 리스너는 ref를 통해 항상 최신 콜백을 호출합니다.
        sse.addEventListener('chat_response', (event: any) => {
          callbacksRef.current.onChatResponse(event.data)
        })

        sse.addEventListener('ai_response_id', (event: any) => {
          callbacksRef.current.onResponseId(event.data)
        })

        sse.addEventListener('current_level_finished', () => {
          callbacksRef.current.onLevelFinished()
        })

        sse.addEventListener('chat_room_paused', () => {
          callbacksRef.current.onChatPaused()
        })
      } catch (error) {
        callbacksRef.current.onError?.(error)
      }
    }

    connect()

    // 컴포넌트가 언마운트될 때 연결을 정리합니다.
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
        eventSourceRef.current = null
        console.log('SSE connection closed.')
      }
    }
  }, []) // 빈 의존성 배열이 핵심입니다.
}
