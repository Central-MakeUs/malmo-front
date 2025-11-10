import { useLayoutEffect, useRef, type ReactNode } from 'react'

import { useScreenLayoutContext, type HeaderBehavior } from './context'

interface ScreenHeaderProps {
  children?: ReactNode
  behavior?: HeaderBehavior
  className?: string
}

export function ScreenHeader({ children, behavior = 'static', className }: ScreenHeaderProps) {
  const layout = useScreenLayoutContext()
  const containerRef = useRef<HTMLDivElement | null>(null)

  useLayoutEffect(() => {
    const node = containerRef.current

    if (!layout) return

    if (!node) {
      layout.unregisterHeader()
      return
    }

    const readHeight = () => {
      const next = Math.max(0, node.offsetHeight)
      layout.setHeader({ behavior, height: next })
    }

    readHeight()

    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(readHeight)
      observer.observe(node)
      return () => {
        observer.disconnect()
        layout.unregisterHeader()
      }
    }

    return () => {
      layout.unregisterHeader()
    }
  }, [behavior, layout, children])

  if (!children) return null

  if (behavior === 'overlay') {
    return (
      <div ref={containerRef} className={['absolute z-40 w-full', className].filter(Boolean).join(' ')}>
        {children}
      </div>
    )
  }

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  )
}
