import React, { useRef, useCallback, useEffect, useState } from 'react'
import { View, StyleSheet, Platform, Keyboard, LayoutAnimation, BackHandler } from 'react-native'
import { createWebView, useBridge, type BridgeWebView } from '@webview-bridge/react-native'
import { appBridge, appSchema } from './bridge'
import { WebViewError } from './components/webview-error'
import { CustomSplashScreen } from './components/splash-screen'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import * as SplashScreen from 'expo-splash-screen'
import type { WebViewNavigation } from 'react-native-webview'

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
  const { setKeyboardHeight, isModalOpen, setModalOpen, isLoggedIn } = useBridge(appBridge)
  const insets = useSafeAreaInsets()
  const [showSplash, setShowSplash] = useState(true)
  const [canGoBack, setCanGoBack] = useState(false)
  const [isAuthReady, setIsAuthReady] = useState(false)

  // const webviewUrl = process.env.EXPO_PUBLIC_WEB_VIEW_URL
  const webviewUrl = process.env.EXPO_PUBLIC_LOCAL_URL
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

  // Bridge 하이드레이션 완료 후에만 WebView를 노출
  useEffect(() => {
    let isMounted = true

    const initializeAuthState = async () => {
      const authStatus = appBridge.getState().getAuthStatus

      await authStatus()
      if (isMounted) setIsAuthReady(true)
    }

    void initializeAuthState().catch((error) => {
      console.error('Failed to initialize auth state', error)
      if (isMounted) setIsAuthReady(true)
    })

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    setCanGoBack(false)
  }, [isLoggedIn])

  const handleRetry = useCallback(() => {
    webviewRef.current?.reload()
  }, [])
  const handleLoadEnd = useCallback(() => {}, [])
  const handleSplashFinish = useCallback(() => setShowSplash(false), [])
  const handleNavigationStateChange = useCallback((navState: WebViewNavigation) => {
    setCanGoBack(navState.canGoBack)
  }, [])

  useEffect(() => {
    if (Platform.OS !== 'android') return

    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (isModalOpen) {
        void setModalOpen(false)
        return true
      }

      if (canGoBack) {
        webviewRef.current?.goBack()
        return true
      }

      return false
    })

    return () => {
      subscription.remove()
    }
  }, [canGoBack, isModalOpen, setModalOpen])

  return (
    <View style={styles.container}>
      {isAuthReady && (
        <WebView
          key={String(isLoggedIn)}
          ref={webviewRef}
          source={{ uri: webviewUrl }}
          overScrollMode="never"
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
          allowsBackForwardNavigationGestures={Platform.OS === 'ios' && !isModalOpen}
          onShouldStartLoadWithRequest={() => true}
          onNavigationStateChange={handleNavigationStateChange}
          renderError={(domain, code, description) => (
            <WebViewError onRetry={handleRetry} errorDomain={domain} errorCode={code} errorDescription={description} />
          )}
          startInLoadingState={false}
          onLoadEnd={handleLoadEnd}
        />
      )}
      {showSplash && <CustomSplashScreen onAnimationFinish={handleSplashFinish} />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  webview: { flex: 1, backgroundColor: 'transparent' },
})
