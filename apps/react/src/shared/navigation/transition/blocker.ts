import { buildTransitionMetadata } from './utils'

import type { HistoryAction, HistoryLikeLocation, ParsedHistoryStateLike } from './types'
import type { TransitionControllerDeps } from './types'

export const createHistoryBlocker =
  (deps: TransitionControllerDeps) =>
  ({
    action,
    nextLocation,
    currentLocation,
  }: {
    action: HistoryAction | string | undefined
    nextLocation: HistoryLikeLocation
    currentLocation: HistoryLikeLocation
  }) => {
    const nextParsed = deps.parseLocation(nextLocation)
    const currentParsed = deps.parseLocation(currentLocation)
    const nextState = (nextLocation.state ?? {}) as ParsedHistoryStateLike

    const metadata = buildTransitionMetadata(action, nextParsed, currentParsed, nextState)

    const transitionId = deps.generateTransitionId()

    if (metadata.nextState?.skipTransition === true) {
      const href = (nextParsed as any)?.href ?? (nextParsed as any)?.pathname
      // 커밋 직후에 플래그 해제
      setTimeout(() => {
        try {
          deps.replaceState?.({ to: href, state: { ...metadata.nextState, skipTransition: false } })
        } catch (e) {
          void e
        }
      }, 0)
      if (metadata.direction === 'forward') {
        deps.setSnapshot(null)
        return false
      }
    }
    const manualBackIntent = metadata.direction === 'back' ? deps.consumeManualBackIntent() : false

    const initiator =
      metadata.direction === 'back'
        ? metadata.action === 'BACK'
          ? manualBackIntent
            ? 'manual'
            : 'system'
          : 'manual'
        : 'manual'

    let resolved = false

    return new Promise<boolean>((resolveBlock) => {
      const clearIfCurrent = () => deps.clearSnapshotById(transitionId)

      const proceed = () => {
        if (!resolved) {
          resolved = true
          resolveBlock(false)
          clearIfCurrent()
        }
      }

      const reset = () => {
        if (!resolved) {
          resolved = true
          resolveBlock(true)
          clearIfCurrent()
        }
      }

      deps.setSnapshot({
        id: transitionId,
        phase: 'pending',
        action: metadata.action ?? 'PUSH',
        direction: metadata.direction,
        fromEntry: metadata.fromEntry,
        toEntry: metadata.toEntry,
        skip: false,
        initiator,
        proceed,
        reset,
      })
    })
  }
