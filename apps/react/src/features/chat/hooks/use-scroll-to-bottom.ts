import { useCallback, useEffect, useState, type RefObject } from 'react'

type UseScrollToBottomOptions = {
  scrollRef: RefObject<HTMLElement>
  deps?: Array<unknown>
}

const BOTTOM_THRESHOLD = 24

export function useScrollToBottom({ scrollRef, deps = [] }: UseScrollToBottomOptions) {
  const [isAtBottom, setIsAtBottom] = useState(true)

  const updateIsAtBottom = useCallback(() => {
    const container = scrollRef.current
    if (!container) return
    const atBottom = container.scrollHeight - container.scrollTop - container.clientHeight <= BOTTOM_THRESHOLD
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
