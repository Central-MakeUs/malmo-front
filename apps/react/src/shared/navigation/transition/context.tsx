import { useRouter, useRouterState } from '@tanstack/react-router'
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'

import { consumeManualBack } from '../back'
import { getLocationKey } from '../navigation-entry'
import { createHistoryBlocker } from './blocker'
import { parseHistoryLocation } from './utils'

import type { NavigationTransitionContextValue, NavigationTransitionSnapshot } from './types'
import type { HistoryLikeLocation } from './types'

const NavigationTransitionContext = createContext<NavigationTransitionContextValue | null>(null)

const INITIAL_SNAPSHOT: NavigationTransitionSnapshot | null = null

export function NavigationTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const routerState = useRouterState()
  const latestLocation = routerState?.location ?? router.state.location

  const [snapshot, setSnapshot] = useState<NavigationTransitionSnapshot | null>(INITIAL_SNAPSHOT)
  const transitionIdRef = useRef(0)

  const clear = useCallback(() => {
    setSnapshot(INITIAL_SNAPSHOT)
  }, [])

  const parseLocation = useCallback(
    (historyLocation: HistoryLikeLocation) =>
      parseHistoryLocation(router.parseLocation, historyLocation, latestLocation),
    [latestLocation, router.parseLocation]
  )

  const clearSnapshotById = useCallback((id: number) => {
    setSnapshot((prev) => (prev && prev.id === id ? null : prev))
  }, [])

  useEffect(() => {
    const unblock = router.history.block({
      blockerFn: createHistoryBlocker({
        parseLocation,
        consumeManualBackIntent: consumeManualBack,
        setSnapshot,
        clearSnapshotById,
        generateTransitionId: () => {
          transitionIdRef.current += 1
          return transitionIdRef.current
        },
        replaceState: ({ to, state }) => {
          try {
            router.history.replace({ to, state } as any)
          } catch (e) {
            void e
          }
        },
      }),
    })

    return () => {
      unblock?.()
    }
  }, [parseLocation, router.history, clearSnapshotById])

  useEffect(() => {
    if (snapshot) {
      const currentKey = getLocationKey(latestLocation)
      if (snapshot.toEntry.key === currentKey) {
        setSnapshot((prev) => (prev && prev.id === snapshot.id ? null : prev))
      }
    }
  }, [latestLocation, snapshot])

  const contextValue = useMemo<NavigationTransitionContextValue>(
    () => ({
      snapshot,
      clear,
    }),
    [clear, snapshot]
  )

  return <NavigationTransitionContext.Provider value={contextValue}>{children}</NavigationTransitionContext.Provider>
}

export function useNavigationTransition() {
  const context = useContext(NavigationTransitionContext)
  if (!context) {
    throw new Error('useNavigationTransition must be used within NavigationTransitionProvider')
  }
  return context
}
