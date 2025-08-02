import React, { useRef, useCallback, useEffect } from 'react'
import { SafeAreaView, View, StyleSheet, Platform, Keyboard, LayoutAnimation } from 'react-native'
import { createWebView, useBridge, type BridgeWebView } from '@webview-bridge/react-native'
import { appBridge, appSchema } from './bridge'
import { useOverlay } from './features/overlay/use-overlay'
import { DynamicStatusBar } from './features/status-bar/dynamic-status-bar'
import { WebViewError } from './components/webview-error'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

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
  const { setKeyboardHeight } = useBridge(appBridge)
  const insets = useSafeAreaInsets()

  // const webviewUrl =  process.env.EXPO_PUBLIC_WEB_VIEW_URL
  const webviewUrl =
    Platform.OS === 'ios' ? process.env.EXPO_PUBLIC_LOCAL_URL : process.env.EXPO_PUBLIC_ANDROID_WEB_VIEW_URL

  if (!webviewUrl) {
    throw new Error('Webview URL is not set')
  }

  useEffect(() => {
    // 1. iOS에서만 키보드 이벤트 리스너를 실행하도록 수정
    if (Platform.OS !== 'ios') return

    const showEvent = 'keyboardWillShow'
    const hideEvent = 'keyboardWillHide'

    const keyboardDidShowListener = Keyboard.addListener(showEvent, (e) => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.linear)
      setKeyboardHeight(e.endCoordinates.height - insets.bottom)
    })

    const keyboardDidHideListener = Keyboard.addListener(hideEvent, () => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.linear)
      setKeyboardHeight(0)
    })

    return () => {
      keyboardDidShowListener.remove()
      keyboardDidHideListener.remove()
    }
  }, [insets.bottom, setKeyboardHeight])

  const handleLoadEnd = useCallback(() => {
    console.log('Webview load end')
  }, [])

  const handleRetry = useCallback(() => {
    webviewRef.current?.reload() // 웹뷰 새로고침
  }, [])

  return (
    <View style={styles.container}>
      <DynamicStatusBar />
      {OverlayComponent}

      <SafeAreaView style={[styles.safeArea, { paddingTop: Platform.OS === 'android' ? insets.top : 0 }]}>
        <WebView
          ref={webviewRef}
          source={{ uri: webviewUrl }}
          style={styles.webview}
          bounces={false}
          scrollEnabled={false}
          domStorageEnabled
          javaScriptEnabled
          allowsFullscreenVideo
          allowsInlineMediaPlayback
          mediaPlaybackRequiresUserAction={false}
          originWhitelist={['*']}
          mixedContentMode="compatibility"
          allowsBackForwardNavigationGestures={false}
          onShouldStartLoadWithRequest={() => true}
          renderError={() => <WebViewError onRetry={handleRetry} />}
          startInLoadingState={false}
          onLoadEnd={handleLoadEnd}
        />
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
