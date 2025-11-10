import type { ParsedLocation } from '@tanstack/router-core'

type NavigationState = Record<string, unknown> & {
  key?: string
}

export interface NavigationEntry {
  key: string
  location: ParsedLocation
}

export const getLocationKey = (location: ParsedLocation): string => {
  const state = location.state as NavigationState | undefined
  const key = typeof state?.key === 'string' ? state.key : undefined
  return key ?? location.href
}

export const createNavigationEntry = (location: ParsedLocation): NavigationEntry => ({
  key: getLocationKey(location),
  location,
})
