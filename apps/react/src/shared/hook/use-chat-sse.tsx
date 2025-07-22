import { useEffect, useRef } from 'react'
import { EventSourcePolyfill, NativeEventSource } from 'event-source-polyfill'
import bridge from '../bridge'

// 환경 변수 또는 설정 파일에서 API 호스트 주소를 가져옵니다.
const API_HOST = import.meta.env.VITE_HOST_URL

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
export const useChatSSE = async (callbacks: ChatSSECallbacks) => {
  // EventSource 인스턴스를 저장하기 위한 ref
  const eventSourceRef = useRef<EventSourcePolyfill | null>(null)
  const accessToken = await bridge.getAuthToken()

  useEffect(() => {
    // 이미 연결이 존재하면 중복 생성을 방지
    if (eventSourceRef.current) return

    // SSE 연결 설정
    eventSourceRef.current = new EventSource(`${API_HOST}/sse/connect`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      // 서버와 10분 동안 통신이 없으면 하트비트 메시지를 보내 연결을 유지
      heartbeatTimeout: 600000, // 10분 (단위: ms)
      withCredentials: true,
    })

    const sse = eventSourceRef.current

    // 연결 성공 시
    sse.onopen = () => {
      console.log('SSE connection opened.')
      callbacks.onOpen?.()
    }

    // 에러 발생 시 (네트워크 문제, 인증 실패 등)
    sse.onerror = (error) => {
      console.error('SSE Error:', error)
      callbacks.onError?.(error)
      // polyfill이 자동으로 재연결을 시도하므로, 여기서는 연결을 닫지 않습니다.
    }

    // === AI 채팅 커스텀 이벤트 리스너 등록 ===

    // 1. AI 응답 스트리밍
    sse.addEventListener('chat_response', (event: any) => {
      const responseChunk = JSON.parse(event.data) // 서버 구현에 따라 JSON.parse가 필요할 수 있음
      callbacks.onChatResponse(responseChunk)
    })

    // 2. AI 응답 완료 (메시지 ID 수신)
    sse.addEventListener('ai_response_id', (event: any) => {
      callbacks.onResponseId(event.data)
    })

    // 3. 현재 단계 완료
    sse.addEventListener('current_level_finished', () => {
      callbacks.onLevelFinished()
    })

    // 4. 채팅방 일시정지 (커플 연결 필요)
    sse.addEventListener('chat_room_paused', () => {
      callbacks.onChatPaused()
    })

    // 컴포넌트가 언마운트될 때 SSE 연결을 반드시 종료합니다.
    return () => {
      if (sse) {
        sse.close()
        eventSourceRef.current = null
        console.log('SSE connection closed.')
      }
    }
  }, [callbacks])
}
