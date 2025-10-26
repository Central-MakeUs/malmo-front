import { type ReactNode } from 'react'
import { createPortal } from 'react-dom'

const FIXED_LAYER_ID = 'malmo-fixed-layer'

export function FixedLayerRoot() {
  return <div id={FIXED_LAYER_ID} className="pointer-events-none fixed inset-0 z-[999]" />
}

export function FixedLayerPortal({ children }: { children: ReactNode }) {
  if (typeof document === 'undefined') return null

  const element = document.getElementById(FIXED_LAYER_ID)
  if (!element) return null

  return createPortal(children, element)
}
