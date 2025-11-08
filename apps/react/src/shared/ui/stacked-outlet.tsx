import { Outlet, getRouterContext, useRouterState } from '@tanstack/react-router'
import { motion, useReducedMotion } from 'motion/react'
import { useContext, useEffect, useMemo, useRef, useState } from 'react'

import { useNavigationTransition } from '@/shared/navigation/transition'
import { RoutePhaseProvider } from '@/shared/navigation/transition/route-phase-context'
import { snapshotRouterContext, type RouterLike } from '@/shared/navigation/use-frozen-router-context'

type Direction = 'forward' | 'back' | 'none'

type FrozenEntry = {
  id: string
  pathname: string
  context: any
  direction: Direction
}

const DEFAULT_EASE: [number, number, number, number] = [0, 0, 0.58, 1]
const EXIT_TRANSLATE = 100
const toPercent = (value: number) => `${value}%`

export function NavigationOutlet() {
  const RouterContext = getRouterContext()
  const liveRouter = useContext(RouterContext)
  useRouterState()

  const { snapshot, clear } = useNavigationTransition()
  const lastHandledSnapshotRef = useRef<number | null>(null)

  useEffect(() => {
    if (!snapshot) return
    if (snapshot.id === lastHandledSnapshotRef.current) {
      return
    }

    lastHandledSnapshotRef.current = snapshot.id

    snapshot.proceed()
    clear()
  }, [snapshot, clear])

  return (
    <RoutePhaseProvider value="live">
      <div className="relative h-full w-full">
        <RouterContext.Provider value={liveRouter}>
          <Outlet />
        </RouterContext.Provider>
      </div>
    </RoutePhaseProvider>
  )
}

export function StackedOutlet({
  duration = 0.28,
  ease = DEFAULT_EASE,
  keep = 1,
}: {
  duration?: number
  ease?: [number, number, number, number]
  keep?: number
}) {
  const RouterContext = getRouterContext()
  const liveRouter = useContext(RouterContext)
  const prefersReducedMotion = useReducedMotion() ?? false
  const { snapshot, clear } = useNavigationTransition()

  const routerState = useRouterState()
  const location = routerState?.location ?? (liveRouter as any)?.state?.location
  const routerStatus = routerState?.status ?? (liveRouter as any)?.state?.status ?? 'idle'
  const href = location?.href ?? location?.pathname ?? ''

  const [frozenStack, setFrozenStack] = useState<FrozenEntry[]>([])
  const [currentDirection, setCurrentDirection] = useState<Direction>('none')
  const [showLivePlaceholder, setShowLivePlaceholder] = useState(false)
  const lastHandledSnapshotRef = useRef<number | null>(null)

  const animationDuration = prefersReducedMotion ? 0 : duration

  useEffect(() => {
    if (!snapshot) return
    if (snapshot.id === lastHandledSnapshotRef.current) {
      return
    }
    lastHandledSnapshotRef.current = snapshot.id

    const goingToLoading = snapshot.toEntry?.location.pathname?.startsWith('/chat/loading')

    if (snapshot.direction === 'forward' && goingToLoading) {
      setFrozenStack([])
      setCurrentDirection('forward')
      snapshot.proceed()
      clear()
      return
    }

    if (snapshot.skip) {
      snapshot.proceed()
      clear()
      setCurrentDirection('none')
      return
    }

    const shouldSkipBackAnimation = snapshot.direction === 'back' && snapshot.initiator === 'system'

    if (shouldSkipBackAnimation) {
      setCurrentDirection('none')
      snapshot.proceed()
      clear()
      setFrozenStack([])
      return
    }

    setCurrentDirection(snapshot.direction)

    if (snapshot.direction === 'back' || snapshot.direction === 'forward') {
      const frozenContext = snapshotRouterContext(liveRouter as RouterLike, {
        location: snapshot.fromEntry?.location,
      })
      const entry: FrozenEntry = {
        id: `${snapshot.id}-${snapshot.fromEntry?.key ?? snapshot.fromEntry?.location.pathname ?? 'unknown'}`,
        pathname: snapshot.fromEntry?.location.pathname ?? '',
        context: frozenContext,
        direction: snapshot.direction,
      }

      setFrozenStack((prev) => {
        const next = [...prev, entry]
        while (next.length > keep) {
          next.shift()
        }
        return next
      })
    } else {
      setFrozenStack([])
    }

    snapshot.proceed()
    clear()
  }, [snapshot, liveRouter, keep, clear])

  useEffect(() => {
    setShowLivePlaceholder(routerStatus === 'pending')
  }, [routerStatus])

  const handleFrozenExit = (id: string) => {
    setFrozenStack((prev) => prev.filter((entry) => entry.id !== id))
  }

  const handleLiveComplete = () => {
    setCurrentDirection('none')
  }

  const liveInitialStyle = useMemo(() => {
    if (prefersReducedMotion || currentDirection === 'none') {
      return { x: 0 }
    }
    if (currentDirection === 'back') {
      return { x: 0 }
    }
    if (currentDirection === 'forward') {
      return { x: toPercent(EXIT_TRANSLATE) }
    }
    return { x: 0 }
  }, [prefersReducedMotion, currentDirection])

  const liveAnimationTarget = { x: 0 }
  const liveTransition = { duration: animationDuration, ease }

  const liveZ = currentDirection === 'back' ? 'z-0' : 'z-10'

  return (
    <div className="relative h-full w-full overflow-hidden">
      {frozenStack.map((entry) => (
        <RoutePhaseProvider key={entry.id} value="frozen">
          <FrozenScreen
            entry={entry}
            prefersReducedMotion={prefersReducedMotion}
            duration={animationDuration}
            ease={ease}
            onExitComplete={handleFrozenExit}
          />
        </RoutePhaseProvider>
      ))}

      <RoutePhaseProvider value="live">
        <motion.div
          key={href}
          className={`relative ${liveZ} h-full w-full`}
          initial={liveInitialStyle}
          animate={liveAnimationTarget}
          transition={liveTransition}
          onAnimationComplete={handleLiveComplete}
        >
          <RouterContext.Provider value={liveRouter}>
            {showLivePlaceholder && <div className="absolute inset-0 z-9999 bg-white" />}
            <Outlet />
          </RouterContext.Provider>
        </motion.div>
      </RoutePhaseProvider>
    </div>
  )
}

function FrozenScreen({
  entry,
  prefersReducedMotion,
  duration,
  ease,
  onExitComplete,
}: {
  entry: FrozenEntry
  prefersReducedMotion: boolean
  duration: number
  ease: [number, number, number, number]
  onExitComplete: (id: string) => void
}) {
  const RouterContext = getRouterContext()
  const transition = prefersReducedMotion ? { duration: 0 } : { duration, ease }
  const target = entry.direction === 'back' ? { x: toPercent(EXIT_TRANSLATE) } : { x: 0 }

  useEffect(() => {
    if (entry.direction !== 'forward') return

    if (prefersReducedMotion || duration === 0) {
      onExitComplete(entry.id)
      return
    }

    if (typeof window === 'undefined') {
      onExitComplete(entry.id)
      return
    }

    const timeout = window.setTimeout(() => onExitComplete(entry.id), duration * 1000)

    return () => {
      window.clearTimeout(timeout)
    }
  }, [entry.direction, prefersReducedMotion, duration, entry.id, onExitComplete])

  const handleAnimationComplete = () => {
    if (entry.direction === 'back') {
      onExitComplete(entry.id)
    }
  }

  return (
    <motion.div
      className={`pointer-events-none absolute inset-0 ${entry.direction === 'back' ? 'z-20' : 'z-0'} h-full w-full`}
      initial={{ x: 0 }}
      animate={prefersReducedMotion ? { x: 0 } : target}
      transition={transition}
      onAnimationComplete={handleAnimationComplete}
    >
      <RouterContext.Provider value={entry.context}>
        <Outlet />
      </RouterContext.Provider>
    </motion.div>
  )
}
