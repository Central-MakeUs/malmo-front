import { createNavigationEntry } from '../navigation-entry'

import type { Direction, HistoryAction, HistoryLikeLocation, ParsedHistoryStateLike, TransitionMetadata } from './types'
import type { ParsedLocation } from '@tanstack/router-core'

/**
 * History 액션을 표준 문자열로 변환
 */
export const normalizeAction = (action: HistoryAction | string | undefined): HistoryAction | undefined => {
  if (!action) return undefined
  const upper = action.toString().toUpperCase()
  if (upper === 'PUSH' || upper === 'REPLACE' || upper === 'BACK' || upper === 'FORWARD' || upper === 'GO') {
    return upper as HistoryAction
  }
  return undefined
}

/**
 * TSR가 부여한 히스토리 인덱스 추출
 */
const getHistoryIndex = (location: ParsedLocation, explicitState?: ParsedHistoryStateLike): number | null => {
  const state = explicitState ?? (location.state as ParsedHistoryStateLike | undefined)
  const index = state?.__TSR_index
  return typeof index === 'number' ? index : null
}

/**
 * 이동 방향(back/forward)을 결정
 */
const resolveDirection = (
  action: HistoryAction | undefined,
  nextParsed: ParsedLocation,
  currentParsed: ParsedLocation,
  nextState: ParsedHistoryStateLike
): Direction => {
  if (action === 'BACK') return 'back'
  if (action === 'FORWARD') return 'forward'

  const nextIndex = getHistoryIndex(nextParsed, nextState)
  const currentIndex = getHistoryIndex(currentParsed)

  if (nextIndex !== null && currentIndex !== null) {
    if (nextIndex < currentIndex) return 'back'
    if (nextIndex > currentIndex) return 'forward'
  }

  return action === 'REPLACE' ? 'forward' : 'forward'
}

/**
 * 히스토리 Location 파싱
 */
export const parseHistoryLocation = (
  routerParseLocation: (previousLocation?: ParsedLocation, locationToParse?: HistoryLikeLocation) => ParsedLocation,
  historyLocation: HistoryLikeLocation,
  fallback: ParsedLocation
): ParsedLocation => {
  try {
    return routerParseLocation(fallback, historyLocation)
  } catch {
    return fallback
  }
}

/**
 * 전환 메타데이터 구성(액션/방향/엔트리)
 */
export const buildTransitionMetadata = (
  action: HistoryAction | string | undefined,
  nextParsed: ParsedLocation,
  currentParsed: ParsedLocation,
  nextState: ParsedHistoryStateLike
): TransitionMetadata => {
  const normalizedAction = normalizeAction(action)
  const direction = resolveDirection(normalizedAction, nextParsed, currentParsed, nextState)

  return {
    action: normalizedAction,
    direction,
    toEntry: createNavigationEntry(nextParsed),
    fromEntry: createNavigationEntry(currentParsed),
    nextState,
  }
}
