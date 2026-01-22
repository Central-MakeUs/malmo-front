import { ChatRoomMessageData } from '@data/user-api-axios/api'
import { useBridge } from '@webview-bridge/react'
import { useCallback, useLayoutEffect, useRef, useEffect } from 'react'

import bridge from '@/shared/bridge'

const BOTTOM_STICK_THRESHOLD = 24

const isNearBottom = (element: HTMLElement) =>
  element.scrollHeight - element.scrollTop - element.clientHeight <= BOTTOM_STICK_THRESHOLD

function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined)
  useEffect(() => {
    ref.current = value
  }, [value])
  return ref.current
}

type UseChatScrollProps = {
  chatId?: number
  isFetchingNextPage: boolean
  sendingMessage: boolean
  messages: ChatRoomMessageData[]
  streamingMessage: ChatRoomMessageData | null
  awaitingResponse: boolean
}

export function useChatScroll({
  chatId,
  isFetchingNextPage,
  sendingMessage,
  messages,
  streamingMessage,
  awaitingResponse,
}: UseChatScrollProps) {
  const keyboardHeight = useBridge(bridge.store, (state) => state.keyboardHeight)
  const scrollRef = useRef<HTMLDivElement>(null)
  const isAtBottomRef = useRef(true)

  useEffect(() => {
    if (!('visualViewport' in window)) return
    const viewport = window.visualViewport
    if (!viewport) return
    let prevHeight = viewport.height

    const handleResize = () => {
      const heightReduced = viewport.height < prevHeight
      prevHeight = viewport.height
      if (!scrollRef.current) return

      if (heightReduced && keyboardHeight === 0) {
        if (!isAtBottomRef.current) return
        // Android 키보드가 올라오면 최하단 유지
        requestAnimationFrame(() => {
          scrollRef.current!.scrollTop = scrollRef.current!.scrollHeight
        })
      }
    }

    viewport.addEventListener('resize', handleResize)
    return () => viewport.removeEventListener('resize', handleResize)
  }, [keyboardHeight])

  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    const handleScroll = () => {
      isAtBottomRef.current = isNearBottom(scrollContainer)
    }

    handleScroll()
    scrollContainer.addEventListener('scroll', handleScroll)
    return () => scrollContainer.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollHeightRef = useRef(0)
  const prevIsFetchingNextPage = usePrevious(isFetchingNextPage)
  const prevKeyboardHeight = usePrevious(keyboardHeight)

  const smoothScrollTo = useCallback((element: HTMLElement, to: number, duration: number) => {
    const start = element.scrollTop
    const change = to - start
    let startTime: number | null = null

    const animateScroll = (currentTime: number) => {
      if (startTime === null) startTime = currentTime
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      element.scrollTop = start + change * progress
      if (elapsed < duration) {
        requestAnimationFrame(animateScroll)
      }
    }
    requestAnimationFrame(animateScroll)
  }, [])

  useLayoutEffect(() => {
    if (chatId) return
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    const keyboardIsClosing = typeof prevKeyboardHeight !== 'undefined' && keyboardHeight < prevKeyboardHeight

    if (keyboardIsClosing && !sendingMessage) {
      scrollHeightRef.current = scrollContainer.scrollHeight // 스크롤 위치는 업데이트
      return
    }

    const keyboardHeightChanged = typeof prevKeyboardHeight !== 'undefined' && prevKeyboardHeight !== keyboardHeight
    if (keyboardHeightChanged) {
      if (!isAtBottomRef.current) return
      setTimeout(() => {
        smoothScrollTo(scrollContainer, scrollContainer.scrollHeight, 250)
      }, 0)
      return
    }

    const justFinishedInfiniteScroll = prevIsFetchingNextPage && !isFetchingNextPage
    const isInitialLoad = scrollHeightRef.current === 0 && scrollContainer.scrollHeight > 0
    const isNewMessageAdded =
      !isInitialLoad && scrollContainer.scrollHeight > scrollHeightRef.current && !justFinishedInfiniteScroll

    if (justFinishedInfiniteScroll) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight - scrollHeightRef.current
    } else if (isInitialLoad || isNewMessageAdded) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight
    }

    scrollHeightRef.current = scrollContainer.scrollHeight
  }, [
    messages,
    chatId,
    isFetchingNextPage,
    prevIsFetchingNextPage,
    streamingMessage,
    awaitingResponse,
    keyboardHeight,
    prevKeyboardHeight,
    smoothScrollTo,
    sendingMessage,
  ])

  return scrollRef
}
