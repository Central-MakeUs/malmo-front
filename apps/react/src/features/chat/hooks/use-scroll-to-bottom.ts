import { useCallback, useEffect, useState, type RefObject } from 'react'

type UseScrollToBottomOptions<T extends HTMLElement = HTMLElement> = {
  scrollRef: RefObject<T | null>
  deps?: Array<unknown>
}

const MIN_BOTTOM_THRESHOLD = 24

export function useScrollToBottom<T extends HTMLElement = HTMLElement>({
  scrollRef,
  deps = [],
}: UseScrollToBottomOptions<T>) {
  const [isAtBottom, setIsAtBottom] = useState(true)

  const updateIsAtBottom = useCallback(() => {
    const container = scrollRef.current
    if (!container) return
    const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight
    const threshold = Math.max(MIN_BOTTOM_THRESHOLD, container.clientHeight)
    const atBottom = distanceFromBottom <= threshold
    setIsAtBottom(atBottom)
  }, [scrollRef])

  const scrollToBottom = useCallback(() => {
    const container = scrollRef.current
    if (!container) return
    container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' })
  }, [scrollRef])

  useEffect(() => {
    const container = scrollRef.current
    if (!container) return
    updateIsAtBottom()
    container.addEventListener('scroll', updateIsAtBottom)
    return () => container.removeEventListener('scroll', updateIsAtBottom)
  }, [scrollRef, updateIsAtBottom])

  useEffect(() => {
    updateIsAtBottom()
  }, [updateIsAtBottom, ...deps])

  return { isAtBottom, scrollToBottom }
}
