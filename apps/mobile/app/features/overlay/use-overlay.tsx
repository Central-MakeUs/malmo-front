import { StyleSheet, View } from 'react-native'
import { useBridge } from '@webview-bridge/react-native'
import { appBridge } from '@/app/bridge'

export function useOverlay() {
  const { visible, opacity: targetAlpha } = useBridge(appBridge, (s) => s.overlayState)

  const style = {
    backgroundColor: `rgba(0,0,0,${visible ? targetAlpha : 0})`,
  }

  return {
    OverlayComponent: <View pointerEvents="auto" style={[StyleSheet.absoluteFill, styles.backdrop, style]} />,
  }
}

const styles = StyleSheet.create({
  backdrop: { zIndex: 1 },
})
