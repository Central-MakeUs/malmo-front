import React, { useRef, useCallback } from 'react'
import { SafeAreaView, View, Text, StyleSheet, Platform, KeyboardAvoidingView } from 'react-native'
import { createWebView, type BridgeWebView } from '@webview-bridge/react-native'
import { appBridge, appSchema } from './bridge'
import { useOverlay } from './features/overlay/use-overlay'
import { DynamicStatusBar } from './features/status-bar/dynamic-status-bar'

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
  const { OverlayComponent } = useOverlay()

  const webviewUrl =
    Platform.OS === 'android' ? process.env.EXPO_PUBLIC_ANDROID_WEB_VIEW_URL : process.env.EXPO_PUBLIC_IOS_WEB_VIEW_URL

  if (!webviewUrl) {
    throw new Error('Webview URL is not set')
  }

  const handleLoadEnd = useCallback(() => {
    console.log('Webview load end')
  }, [])

  return (
    <View style={styles.container}>
      <DynamicStatusBar />
      {OverlayComponent}

      <SafeAreaView style={[styles.safeArea]}>
        <WebView
          ref={webviewRef}
          source={{ uri: webviewUrl }}
          style={styles.webview}
          bounces={false}
          domStorageEnabled
          javaScriptEnabled
          allowsFullscreenVideo
          allowsInlineMediaPlayback
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
        <KeyboardAvoidingView behavior={'height'} />
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  safeArea: {
    flex: 1,
    zIndex: 2,
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
})
