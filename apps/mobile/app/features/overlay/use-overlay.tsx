import { StyleSheet, View } from 'react-native'
import { useBridge } from '@webview-bridge/react-native'
import { appBridge } from '@/app/bridge'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export function useOverlay() {
  const { visible, opacity: targetAlpha, upward } = useBridge(appBridge, (s) => s.overlayState)
  const insets = useSafeAreaInsets()

  const style = {
    backgroundColor: `rgba(0,0,0,${visible ? targetAlpha : 0})`,
  }

  return {
    OverlayComponent: (
      <View
        pointerEvents="auto"
        style={[StyleSheet.absoluteFill, styles.backdrop, style, upward && { marginBottom: insets.bottom }]}
      />
    ),
  }
}

const styles = StyleSheet.create({
  backdrop: { zIndex: 1 },
})
