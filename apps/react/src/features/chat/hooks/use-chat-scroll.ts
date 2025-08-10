import { ChatRoomMessageData } from '@data/user-api-axios/api'
import { useCallback, useLayoutEffect, useRef, useEffect } from 'react'

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
  keyboardHeight: number
  sendingMessage: boolean
  messages: ChatRoomMessageData[]
  streamingMessage: ChatRoomMessageData | null
}

export function useChatScroll({
  chatId,
  isFetchingNextPage,
  keyboardHeight,
  sendingMessage,
  messages,
  streamingMessage,
}: UseChatScrollProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
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
    keyboardHeight,
    prevKeyboardHeight,
    smoothScrollTo,
    sendingMessage,
  ])

  return scrollRef
}
