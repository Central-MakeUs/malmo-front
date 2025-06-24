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

// ----------------------------------------------------------------
// 1. 브릿지 상태 표시 컴포넌트
// ----------------------------------------------------------------
function BridgeStatus() {
  return (
    <div>
      <p>
        <strong>Bridge 연결 상태:</strong> {bridge.isWebViewBridgeAvailable ? '연결됨 ✅' : '연결되지 않음 ❌'}
      </p>
    </div>
  )
}

// ----------------------------------------------------------------
// 2. Native -> Web: 단방향 데이터 수신 및 표시 컴포넌트
// - 네이티브 앱의 'count' 상태가 변경되면 웹뷰도 자동으로 업데이트됩니다.
// ----------------------------------------------------------------
function CounterDisplay() {
  const count = useBridge(bridge.store, (state) => state.count)
  const increase = useBridge(bridge.store, (state) => state.increase)

  const handleIncrease = () => {
    // Web에서 Native로 상태 변경을 요청합니다.
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

// ----------------------------------------------------------------
// 3. Native <-> Web: 양방향 데이터 바인딩 컴포넌트
// - 네이티브 'text' 상태를 웹뷰 Input에 표시하고,
// - 웹뷰 Input 변경 시 네이티브 상태를 업데이트합니다.
// ----------------------------------------------------------------
function DataEditor() {
  const text = useBridge(bridge.store, (state) => state.data.text)

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Web의 Input 변경을 Native 상태에 즉시 반영합니다.
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

// ----------------------------------------------------------------
// 4. Native -> Web: 이벤트 수신 및 비동기 함수 호출 컴포넌트
// ----------------------------------------------------------------
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

// ----------------------------------------------------------------
// 5. Web -> Native: 특정 기능 실행 요청 컴포넌트
// ----------------------------------------------------------------
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

function BridgeDemoPage() {
  return (
    <div className="mb-[120px] flex flex-col gap-4 p-4">
      <h1>React WebView Bridge 데모</h1>
      <BridgeStatus />
      <hr />
      <MessageDisplay />
      <hr />
      <CounterDisplay />
      <hr />
      <DataEditor />
      <hr />
      <InAppBrowserButton />
    </div>
  )
}
