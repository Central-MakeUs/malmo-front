import { appBridge } from '@/app/bridge'
import React, { useEffect, useSyncExternalStore } from 'react'
import { View, Platform, StatusBar, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface Props {
  barStyle?: 'light-content' | 'dark-content'
}

export function DynamicStatusBar({ barStyle = 'dark-content' }: Props) {
  const insets = useSafeAreaInsets()
  const statusBarColor = useSyncExternalStore(appBridge.subscribe, () => appBridge.getState().statusBarColor)

  // 시스템 StatusBar 조작 -------------------------
  useEffect(() => {
    StatusBar.setBarStyle(barStyle, true)
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(statusBarColor, true)
      StatusBar.setTranslucent(true)
    }
  }, [statusBarColor, barStyle])

  // iOS용 더미 뷰(안드로이드는 padding으로 해결) ----
  return Platform.OS === 'ios' ? (
    <View style={[styles.shim, { height: insets.top, backgroundColor: statusBarColor }]} />
  ) : null
}

const styles = StyleSheet.create({
  shim: { width: '100%' },
})
