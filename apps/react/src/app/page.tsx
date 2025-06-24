import { createFileRoute } from '@tanstack/react-router'
import { linkBridge } from '@webview-bridge/web'
import { useState, useEffect } from 'react'
import { AppBridge, AppPostMessageSchema } from '@mobile/bridge'

export const Route = createFileRoute('/')({
  component: HomePage,
})

const bridge = linkBridge<AppBridge, AppPostMessageSchema>({
  throwOnError: true,
  onReady: () => {
    console.log('bridge is ready')
  },
  onFallback: (methodName, args) => {
    console.log('fallback', methodName, args)
  },
})

function HomePage() {
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function init() {
      const message = await bridge.getMessage()
      setMessage(message)
    }

    init()
  }, [])

  useEffect(() => {
    // Subscribe to events from react native.
    return bridge.addEventListener('setWebMessage_zod', ({ message }) => {
      setMessage(message)
    })
  }, [])

  useEffect(() => {
    // Subscribe to events from react native.
    return bridge.addEventListener('setWebMessage_valibot', ({ message }) => {
      setMessage(message)
    })
  }, [])

  return (
    <div>
      <h1>This is a web.</h1>
      <h1>{message}</h1>
      <button
        style={{ border: '1px solid black', padding: '10px', margin: '10px' }}
        onClick={() => {
          if (bridge.isNativeMethodAvailable('openInAppBrowser') === true) {
            bridge.openInAppBrowser('https://github.com/gronxb/webview-bridge')
          }
        }}
      >
        open InAppBrowser
      </button>

      <div>{`isWebViewBridgeAvailable: ${String(bridge.isWebViewBridgeAvailable)}`}</div>
    </div>
  )
}
