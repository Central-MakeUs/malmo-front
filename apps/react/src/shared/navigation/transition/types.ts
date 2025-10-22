import type { NavigationEntry } from '../navigation-entry'
import type { ParsedLocation } from '@tanstack/router-core'

export type HistoryAction = 'PUSH' | 'REPLACE' | 'FORWARD' | 'BACK' | 'GO'
export type Direction = 'forward' | 'back'

export type TransitionPhase = 'idle' | 'pending'
export type NavigationInitiator = 'manual' | 'system'

export interface NavigationTransitionSnapshot {
  id: number
  phase: TransitionPhase
  action: HistoryAction
  direction: Direction
  fromEntry: NavigationEntry | null
  toEntry: NavigationEntry
  skip: boolean
  initiator: NavigationInitiator
  proceed: () => void
  reset: () => void
}

export interface NavigationTransitionContextValue {
  snapshot: NavigationTransitionSnapshot | null
  clear: () => void
}

export interface HistoryLikeLocation {
  href: string
  pathname: string
  search: string
  hash: string
  state: Record<string, unknown>
}

export type ParsedHistoryStateLike = {
  __TSR_index?: number
  skipTransition?: boolean
}

export interface TransitionMetadata {
  action: HistoryAction | undefined
  direction: Direction
  toEntry: NavigationEntry
  fromEntry: NavigationEntry
  nextState: ParsedHistoryStateLike
}

export interface TransitionControllerDeps {
  parseLocation: (historyLocation: HistoryLikeLocation) => ParsedLocation
  consumeManualBackIntent: () => boolean
  setSnapshot: (snapshot: NavigationTransitionSnapshot | null) => void
  clearSnapshotById: (id: number) => void
  generateTransitionId: () => number
  replaceState?: (opts: { to: string; state?: Record<string, unknown> }) => void
}
