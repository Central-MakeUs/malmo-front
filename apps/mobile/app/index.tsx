import { WebView } from 'react-native-webview'
import { Alert, Button, SafeAreaView, StyleSheet } from 'react-native'
import { useRef } from 'react'

export default function App() {
  const webviewRef = useRef<WebView>(null)

  // Web에서 온 메시지 처리
  const handleMessage = (event: any) => {
    try {
      const { type, payload } = JSON.parse(event.nativeEvent.data)
      if (type === 'dataResponse') {
        Alert.alert('Web에서 응답:', payload.data)
      }
    } catch (error) {
      console.error('메시지 처리 오류', error)
    }
  }

  // Web에 메시지 전송
  const sendMessageToWeb = () => {
    const message = { type: 'getData', payload: {} }
    if (webviewRef.current) {
      webviewRef.current.postMessage(JSON.stringify(message))
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Button title="웹에 데이터 요청" onPress={sendMessageToWeb} />

      <WebView
        ref={webviewRef}
        style={styles.container}
        source={{ uri: 'http://localhost:3001' }}
        javaScriptEnabled={true}
        originWhitelist={['*']}
        startInLoadingState={true}
        scalesPageToFit={true}
        allowFileAccess={true}
        onMessage={handleMessage}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
