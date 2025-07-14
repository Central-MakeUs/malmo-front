import React, { useRef, useCallback } from 'react'
import { SafeAreaView, View, StyleSheet, StatusBar, Platform, KeyboardAvoidingView } from 'react-native'
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
  const webviewRef = useRef<BridgeWebView>(null)

  const webviewUrl =
    Platform.OS === 'android' ? process.env.EXPO_PUBLIC_ANDROID_WEB_VIEW_URL : process.env.EXPO_PUBLIC_IOS_WEB_VIEW_URL

  if (!webviewUrl) {
    throw new Error('Webview URL is not set')
  }

  // 웹뷰 로드 완료 시 처리
  const handleLoadEnd = useCallback(() => {
    console.log('Webview load end')
  }, [])

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardAvoidingView}>
        {/* WebView 영역 */}
        <View style={styles.webviewContainer}>
          <WebView
            ref={webviewRef}
            source={{ uri: webviewUrl }}
            style={styles.webview}
            domStorageEnabled={true}
            javaScriptEnabled={true}
            allowsFullscreenVideo={true}
            allowsInlineMediaPlayback={true}
            mediaPlaybackRequiresUserAction={false}
            originWhitelist={['*']}
            mixedContentMode="compatibility"
            onLoadEnd={handleLoadEnd}
            onError={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent
              console.error('WebView error: ', nativeEvent)
            }}
            onHttpError={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent
              console.error('WebView HTTP error: ', nativeEvent)
            }}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  webviewContainer: {
    flex: 1,
  },
  webview: {
    height: '100%',
    width: '100%',
  },
})
