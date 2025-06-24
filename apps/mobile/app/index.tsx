import React from 'react'
import { Text, Button, SafeAreaView, TextInput, View } from 'react-native'
import { createWebView, useBridge, type BridgeWebView } from '@webview-bridge/react-native'
import { appBridge, appSchema } from './bridge'

export const { WebView, postMessage } = createWebView({
  bridge: appBridge,
  postMessageSchema: appSchema,
  debug: true,
  fallback: (method) => {
    console.warn(`Method '${method}' not found in native`)
  },
})

function Count() {
  // render when count changed
  const count = useBridge(appBridge, (state) => state.count)

  return <Text>Native Count: {count}</Text>
}

function Input() {
  const { data, setDataText } = useBridge(appBridge)

  return (
    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
      <Text
        style={{
          marginBottom: 10,
          textAlign: 'center',
        }}
      >
        Native Data Text: {data.text}
      </Text>
      <TextInput
        value={data.text}
        onChangeText={setDataText}
        style={{ borderWidth: 1, minWidth: '50%', maxWidth: '50%' }}
      />
    </View>
  )
}

export default function App() {
  const webviewRef = React.useRef<BridgeWebView>(null)

  const increase = useBridge(appBridge, (state) => state.increase)

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Text style={{ textAlign: 'center' }}>This is Native</Text>
      <Button title="setWebMessage (zod)" onPress={() => postMessage('setWebMessage_zod', { message: 'zod !' })} />
      <Button
        title="setWebMessage (valibot)"
        onPress={() => postMessage('setWebMessage_valibot', { message: 'valibot !' })}
      />
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Count />
        <Button onPress={() => increase()} title="Increase From Native" />

        <Input />
      </View>

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
