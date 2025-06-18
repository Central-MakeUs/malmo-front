import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@ui/common/components/button'
import { useEffect } from 'react'

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
        const response = { type: 'dataResponse', payload: { data: '반갑습니다.!' } }
        window.ReactNativeWebView.postMessage(JSON.stringify(response))
      }
    } catch (error) {
      console.error('메시지 처리 오류', error)
    }
  }

  return (
    <div>
      <Button onClick={() => handleMessage({ data: JSON.stringify({ type: 'getData', payload: {} }) })}>
        메시지 전송
      </Button>
      <h1>React Web Inside WebView</h1>
    </div>
  )
}
