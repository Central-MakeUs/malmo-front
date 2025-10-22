import { useMemo, useState, useCallback } from 'react'

import { ScreenLayoutContext, type HeaderBehavior } from './context'

import type { ReactNode } from 'react'

interface ScreenRootProps {
  children: ReactNode
  className?: string
}

export function ScreenRoot({ children, className }: ScreenRootProps) {
  const [headerHeight, setHeaderHeight] = useState(0)
  const [headerBehavior, setHeaderBehavior] = useState<HeaderBehavior>('static')

  const setHeader = useCallback((config: { behavior: HeaderBehavior; height: number }) => {
    setHeaderBehavior(config.behavior)
    setHeaderHeight(config.height)
  }, [])

  const unregisterHeader = useCallback(() => {
    setHeaderBehavior('static')
    setHeaderHeight(0)
  }, [])

  const contextValue = useMemo(
    () => ({
      headerHeight,
      headerBehavior,
      setHeader,
      unregisterHeader,
    }),
    [headerHeight, headerBehavior, setHeader, unregisterHeader]
  )

  return (
    <ScreenLayoutContext.Provider value={contextValue}>
      <div className={['relative flex h-full w-full flex-col overflow-hidden', className].filter(Boolean).join(' ')}>
        {children}
      </div>
    </ScreenLayoutContext.Provider>
  )
}
