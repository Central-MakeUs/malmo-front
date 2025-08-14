import React, { useRef, useCallback, useEffect, useState } from 'react'
import { View, StyleSheet, Platform, Keyboard, LayoutAnimation } from 'react-native'
import { createWebView, useBridge, type BridgeWebView } from '@webview-bridge/react-native'
import { appBridge, appSchema } from './bridge'
import { WebViewError } from './components/webview-error'
import { CustomSplashScreen } from './components/splash-screen'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import * as SplashScreen from 'expo-splash-screen'

export const { WebView, postMessage } = createWebView({
  bridge: appBridge,
  postMessageSchema: appSchema,
  debug: true,
  fallback: (method) => {
    console.warn(`Method '${method}' not found in native`)
  },
})

SplashScreen.preventAutoHideAsync()

export default function App() {
  const webviewRef = useRef<BridgeWebView>(null)
  const { setKeyboardHeight } = useBridge(appBridge)
  const insets = useSafeAreaInsets()
  const [showSplash, setShowSplash] = useState(true)

  // const webviewUrl =  process.env.EXPO_PUBLIC_WEB_VIEW_URL
  const webviewUrl =
    Platform.OS === 'ios' ? process.env.EXPO_PUBLIC_LOCAL_URL : process.env.EXPO_PUBLIC_ANDROID_WEB_VIEW_URL
  if (!webviewUrl) throw new Error('Webview URL is not set')

  useEffect(() => {
    if (Platform.OS !== 'ios') return
    const showEvent = 'keyboardWillShow'
    const hideEvent = 'keyboardWillHide'
    const showSub = Keyboard.addListener(showEvent, (e) => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.linear)
      setKeyboardHeight(e.endCoordinates.height - insets.bottom)
    })
    const hideSub = Keyboard.addListener(hideEvent, () => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.linear)
      setKeyboardHeight(0)
    })
    return () => {
      showSub.remove()
      hideSub.remove()
    }
  }, [insets.bottom, setKeyboardHeight])

  const handleRetry = useCallback(() => {
    webviewRef.current?.reload()
  }, [])
  const handleLoadEnd = useCallback(() => {}, [])
  const handleSplashFinish = useCallback(() => setShowSplash(false), [])

  return (
    <View style={styles.container}>
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
      {showSplash && <CustomSplashScreen onAnimationFinish={handleSplashFinish} />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  webview: { flex: 1, backgroundColor: 'transparent' },
})
