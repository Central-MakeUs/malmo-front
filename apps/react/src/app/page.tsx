import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'

declare global {
  interface Window {
    ReactNativeWebView: {
      postMessage(message: string): void
    }
  }
}

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  useEffect(() => {
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  const handleMessage = (event) => {
    try {
      const { type, payload } = JSON.parse(event.data)
      if (type === 'getData') {
        // 예시 데이터 처리
        const response = { type: 'dataResponse', payload: { data: '반갑습니다.!' } }
        window.ReactNativeWebView.postMessage(JSON.stringify(response))
      }
    } catch (error) {
      console.error('메시지 처리 오류', error)
    }
  }

  return (
    <div>
      <h1>React Web Inside WebView</h1>
    </div>
  )
}
