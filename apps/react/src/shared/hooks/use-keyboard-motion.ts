import { useBridge } from '@webview-bridge/react'
import { useMemo } from 'react'

import bridge from '@/shared/bridge'
import { isAndroid } from '@/shared/utils'

type Curve = 'linear' | 'easeIn' | 'easeOut' | 'easeInOut' | 'keyboard'

const curveToCss = (curve?: Curve) => {
  switch (curve) {
    case 'linear':
      return 'linear'
    case 'easeIn':
      return 'cubic-bezier(0.42, 0, 1, 1)'
    case 'easeOut':
      return 'cubic-bezier(0, 0, 0.58, 1)'
    case 'easeInOut':
      return 'cubic-bezier(0.25, 0.1, 0.25, 1)'
    case 'keyboard':
    default:
      return 'cubic-bezier(0.17, 0.59, 0.4, 0.77)'
  }
}

function usePrefersReducedMotion() {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

interface Options {
  /** 기본 애니메이션 시간(ms). 브릿지에 값 있으면 그걸 우선 사용 */
  defaultDuration?: number
  /** 기본 곡선. 브릿지에 값 있으면 그걸 우선 사용 */
  defaultCurve?: Curve
  /** 효과 끄기(디버그/안드로이드용 등) */
  disabled?: boolean
  gap?: number
}

/**
 * 브릿지의 keyboard height 변화에 맞춰 transform만 애니메이션하는 훅.
 * - 레이아웃은 고정(bottom:0)
 * - 이동만 transform: translate3d로 처리 → 리플로우/깜빡임 방지
 */
export function useKeyboardSheetMotion(opts: Options = {}) {
  const reduced = usePrefersReducedMotion()

  // 브릿지에서 값만 읽기 (height 필수 사용)
  const keyboardHeight = useBridge(bridge.store, (state) => state.keyboardHeight)

  const duration = Math.max(0, Math.round(reduced ? 1 : (opts.defaultDuration ?? 250)))
  const curve = curveToCss(opts.defaultCurve ?? 'keyboard')
  const gap = Math.max(0, opts.gap ?? 0)

  const motionKeyboardBottom = useMemo<React.CSSProperties>(() => {
    if (opts.disabled) return {}
    const offset = Math.max(0, keyboardHeight) + gap
    return {
      bottom: 0, // 레이아웃 고정
      transform: `translate3d(0, ${-offset}px, 0)`,
      transition: `transform ${duration}ms ${curve}`, // 항상 고정 → 첫 변경부터 부드럽게
      willChange: 'transform',
      paddingBottom: 'env(safe-area-inset-bottom)',
      WebkitBackfaceVisibility: 'hidden',
    }
  }, [keyboardHeight, duration, curve, opts.disabled])

  const keyboardBottom = useMemo<React.CSSProperties>(() => {
    if (opts.disabled) {
      return { paddingBottom: 'var(--safe-bottom)' }
    }

    const defaultBottom = isAndroid() ? '20px' : 'var(--safe-bottom)'

    return {
      paddingBottom: keyboardHeight ? `calc(${keyboardHeight + gap}px + var(--safe-bottom))` : defaultBottom,
      transition: `padding-bottom ${duration}ms ${curve}`,
    }
  }, [keyboardHeight, duration, curve, opts.disabled, gap])

  return {
    motionKeyboardBottom,
    keyboardHeight,
    keyboardBottom,
    duration,
    curveCss: curve,
  }
}
