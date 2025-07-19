// useOverlay.ts
import { useState, useEffect } from 'react'
import { StyleSheet } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
  useDerivedValue,
} from 'react-native-reanimated'
import { useBridge } from '@webview-bridge/react-native'
import { appBridge } from '@/app/bridge'

/* Tailwind 스펙 그대로 ------------------------------------ */
const IN_MS = 150,
  OUT_MS = 100
const CURVE_OUT = Easing.bezier(0, 0, 0.2, 1)
const CURVE_IN = Easing.bezier(0.4, 0, 1, 1)
/* ----------------------------------------------------------- */

export function useOverlay() {
  const { visible, opacity: targetAlpha } = useBridge(appBridge, (s) => s.overlayState)

  // ‑‑‑ 마운트 관리
  const [mounted, setMounted] = useState(visible)
  useEffect(() => {
    if (visible) setMounted(true)
  }, [visible])

  const opacity = useSharedValue(0)

  useDerivedValue(() => {
    opacity.value = withTiming(
      targetAlpha,
      { duration: visible ? IN_MS : OUT_MS, easing: visible ? CURVE_OUT : CURVE_IN },
      (done) => done && !visible && runOnJS(setMounted)(false)
    )
  })

  const style = useAnimatedStyle(() => ({
    backgroundColor: `rgba(0,0,0,${opacity.value})`,
  }))

  return {
    OverlayComponent: mounted ? (
      <Animated.View pointerEvents="auto" style={[StyleSheet.absoluteFill, styles.backdrop, style]} />
    ) : null,
  }
}

const styles = StyleSheet.create({
  backdrop: { zIndex: 1 },
})
