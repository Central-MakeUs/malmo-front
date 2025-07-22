import { useEffect, useRef } from 'react'
import { EventSourcePolyfill, NativeEventSource } from 'event-source-polyfill'
import bridge from '@/shared/bridge'

// 환경 변수 또는 설정 파일에서 API 호스트 주소를 가져옵니다.
// const API_HOST = import.meta.env.VITE_HOST_URL
const API_HOST = '/api'

const EventSource = EventSourcePolyfill || NativeEventSource

/**
 * SSE 이벤트 처리를 위한 콜백 함수들의 타입 정의
 */
interface ChatSSECallbacks {
  onChatResponse: (chunk: string) => void
  onResponseId: (messageId: string) => void
  onLevelFinished: () => void
  onChatPaused: () => void
  onError?: (error: any) => void
  onOpen?: () => void
}

/**
 * AI 채팅 SSE 연결 및 이벤트 처리를 위한 커스텀 훅
 * @param {ChatSSECallbacks} callbacks - SSE 이벤트 발생 시 호출될 콜백 함수 객체
 */
export const useChatSSE = (callbacks: ChatSSECallbacks) => {
  const eventSourceRef = useRef<EventSourcePolyfill | null>(null)

  useEffect(() => {
    const connect = async () => {
      // 이미 연결이 존재하면 중복 생성을 방지
      if (eventSourceRef.current) return

      try {
        const { accessToken } = await bridge.getAuthToken()

        if (!accessToken) {
          callbacks.onError?.(new Error('Access token is missing.'))
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
          callbacks.onOpen?.()
        }

        sse.onerror = (error) => {
          console.error('SSE Error:', error)
          callbacks.onError?.(error)
          // 에러 발생 시 sse.close()를 호출하여 무한 재연결 시도를 막을 수 있습니다.
          // sse.close();
        }

        // 커스텀 이벤트 리스너들...
        sse.addEventListener('chat_response', (event: any) => {
          callbacks.onChatResponse(event.data)
        })

        sse.addEventListener('ai_response_id', (event: any) => {
          callbacks.onResponseId(event.data)
        })

        sse.addEventListener('current_level_finished', () => {
          callbacks.onLevelFinished()
        })

        sse.addEventListener('chat_room_paused', () => {
          callbacks.onChatPaused()
        })
      } catch (error) {
        callbacks.onError?.(error)
      }
    }

    // 함수 실행
    connect()

    // 컴포넌트 언마운트 시 SSE 연결 종료
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
        eventSourceRef.current = null
        console.log('SSE connection closed.')
      }
    }
  }, [
    callbacks.onOpen,
    callbacks.onError,
    callbacks.onChatResponse,
    callbacks.onResponseId,
    callbacks.onLevelFinished,
    callbacks.onChatPaused,
  ])
}
