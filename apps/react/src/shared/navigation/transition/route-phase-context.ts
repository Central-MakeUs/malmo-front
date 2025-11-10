import { createContext, useContext } from 'react'

type RoutePhase = 'live' | 'frozen'

const RoutePhaseContext = createContext<RoutePhase>('live')

export const RoutePhaseProvider = RoutePhaseContext.Provider

export function useRoutePhase() {
  return useContext(RoutePhaseContext)
}

export function useIsFrozenRoute() {
  return useRoutePhase() === 'frozen'
}
