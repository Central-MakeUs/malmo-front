import { createFileRoute } from '@tanstack/react-router'
import { useBridge } from '@webview-bridge/react'
import { useState, useEffect } from 'react'
import { Input } from '@ui/common/components/input'
import { bridge } from '@/app'
import { Button } from '@ui/common/components/button'

// ----------------------------------------------------------------
// 라우트 설정 (TanStack Router)
// ----------------------------------------------------------------
export const Route = createFileRoute('/')({
  component: BridgeDemoPage,
})

function BridgeStatus() {
  return (
    <p>
      <strong>Bridge 연결 상태:</strong> {bridge.isWebViewBridgeAvailable ? '연결됨 ✅' : '연결되지 않음 ❌'}
    </p>
  )
}

function CounterDisplay() {
  const count = useBridge(bridge.store, (state) => state.count)
  const increase = useBridge(bridge.store, (state) => state.increase)

  const handleIncrease = () => {
    increase()
  }

  return (
    <section>
      <h3>카운터 (Native 상태)</h3>
      <p>Native Count: {count}</p>
      <Button onClick={handleIncrease}>Web에서 숫자 증가시키기</Button>
    </section>
  )
}

function DataEditor() {
  const text = useBridge(bridge.store, (state) => state.data.text)

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    bridge.setDataText(e.target.value)
  }

  return (
    <section>
      <h3>데이터 편집기 (Native 상태)</h3>
      <p>Native Data Text: {text}</p>
      <Input type="text" value={text} onChange={handleTextChange} placeholder="Native 상태와 동기화됩니다" />
    </section>
  )
}

function MessageDisplay() {
  const [message, setMessage] = useState('메시지를 기다리는 중...')

  // 컴포넌트 마운트 시, Native로부터 비동기로 메시지를 한 번 가져옵니다.
  useEffect(() => {
    const initMessage = async () => {
      try {
        const receivedMessage = await bridge.getMessage()
        setMessage(receivedMessage)
      } catch (error) {
        console.error('메시지 로딩 실패:', error)
        setMessage('메시지를 가져오는 데 실패했습니다.')
      }
    }
    initMessage()
  }, [])

  // Native에서 보내는 이벤트를 구독합니다.
  useEffect(() => {
    // Zod와 Valibot 스키마에 대한 각각의 이벤트를 구독합니다.
    const unsubscribeZod = bridge.addEventListener('setWebMessage_zod', ({ message }) => {
      setMessage(`(Zod) ${message}`)
    })
    const unsubscribeValibot = bridge.addEventListener('setWebMessage_valibot', ({ message }) => {
      setMessage(`(Valibot) ${message}`)
    })

    // 컴포넌트 언마운트 시 구독을 해제하여 메모리 누수를 방지합니다.
    return () => {
      unsubscribeZod()
      unsubscribeValibot()
    }
  }, [])

  return (
    <section>
      <h3>메시지 디스플레이 (이벤트 & 비동기)</h3>
      <p style={{ fontWeight: 'bold', color: '#007bff' }}>{message}</p>
    </section>
  )
}

function InAppBrowserButton() {
  const handleOpenBrowser = () => {
    if (bridge.isNativeMethodAvailable('openInAppBrowser')) {
      bridge.openInAppBrowser('https://github.com/gronxb/webview-bridge')
    } else {
      alert('InAppBrowser 기능을 사용할 수 없습니다.')
    }
  }

  return (
    <section>
      <h3>In-App 브라우저 열기</h3>
      <Button onClick={handleOpenBrowser}>GitHub 프로젝트 열기</Button>
    </section>
  )
}

function OpenNativeUIButton() {
  const setShowNative = useBridge(bridge.store, (state) => state.setShowNative)
  const showNative = useBridge(bridge.store, (state) => state.showNative)

  return !showNative ? (
    <Button className="w-fit" onClick={() => setShowNative(true)}>
      Native UI 열기
    </Button>
  ) : null
}

function BridgeDemoPage() {
  return (
    <div className="mb-[120px] flex w-full flex-col gap-8 p-4">
      <h1>React WebView Bridge 데모</h1>
      <BridgeStatus />
      <MessageDisplay />
      <CounterDisplay />
      <DataEditor />
      <InAppBrowserButton />
      <OpenNativeUIButton />
    </div>
  )
}
