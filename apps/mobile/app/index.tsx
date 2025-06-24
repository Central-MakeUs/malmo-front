import React from 'react'
import { Text, Button, SafeAreaView } from 'react-native'
import { createWebView, type BridgeWebView } from '@webview-bridge/react-native'
import { appBridge, appSchema } from './bridge'

export const { WebView, postMessage } = createWebView({
  bridge: appBridge,
  postMessageSchema: appSchema,
  debug: true,
  fallback: (method) => {
    console.warn(`Method '${method}' not found in native`)
  },
})

export default function App() {
  const webviewRef = React.useRef<BridgeWebView>(null)

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: '600' }}>This is Native</Text>
      <Button title="setWebMessage (zod)" onPress={() => postMessage('setWebMessage_zod', { message: 'zod !' })} />
      <Button
        title="setWebMessage (valibot)"
        onPress={() => postMessage('setWebMessage_valibot', { message: 'valibot !' })}
      />

      <WebView
        ref={webviewRef}
        source={{
          uri: 'http://localhost:3001',
        }}
        style={{ height: '100%', flex: 1, width: '100%' }}
      />
    </SafeAreaView>
  )
}
