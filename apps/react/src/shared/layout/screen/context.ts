import { createContext, useContext } from 'react'

export type HeaderBehavior = 'static' | 'overlay'

export interface ScreenLayoutContextValue {
  headerHeight: number
  headerBehavior: HeaderBehavior
  setHeader: (config: { behavior: HeaderBehavior; height: number }) => void
  unregisterHeader: () => void
}

export const ScreenLayoutContext = createContext<ScreenLayoutContextValue | null>(null)

export function useScreenLayoutContext() {
  return useContext(ScreenLayoutContext)
}
