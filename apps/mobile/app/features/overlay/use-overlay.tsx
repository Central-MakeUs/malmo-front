import { View, StyleSheet } from 'react-native'
import { useBridge } from '@webview-bridge/react-native'
import { appBridge } from '@/app/bridge'

export function useOverlay() {
  const { visible, opacity } = useBridge(appBridge, (state) => state.overlayState)

  const OverlayComponent = visible && (
    <View style={[styles.backdrop, { backgroundColor: `rgba(0, 0, 0, ${opacity})` }]} />
  )

  return { OverlayComponent }
}

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    flex: 1,
  },
})
