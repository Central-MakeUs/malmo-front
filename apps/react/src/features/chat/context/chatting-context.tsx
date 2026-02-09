import {
  ChatRoomMessageData,
  ChatRoomMessageDataSenderTypeEnum,
  BaseListSwaggerResponseChatRoomMessageData,
} from '@data/user-api-axios/api'
import { InfiniteData, useQueryClient } from '@tanstack/react-query'
import { createContext, useContext, ReactNode, useCallback, useRef, useState } from 'react'

import { useSSESubscription } from '@/shared/contexts/sse-context'
import chatService from '@/shared/services/chat.service'

import { useCurrentChatRoomQuery, useSendMessageMutation, useUpgradeChatRoomMutation } from '../hooks/use-chat-queries'
import { groupSentences } from '../util/chat-format'

interface ChattingContextType {
  sendingMessage: boolean
  streamingMessage: ChatRoomMessageData | null
  awaitingResponse: boolean
  sendMessageWithReconnect: (message: string, chatRoomId?: number) => Promise<void>
  setActiveChatRoomId: (chatRoomId?: number) => void
}

export const ChattingContext = createContext<ChattingContextType | undefined>(undefined)

const TERMINATION_MESSAGE_START = '이제 대화가 종료되었어!'

export function ChattingProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const [sendingMessage, setSendingMessage] = useState<boolean>(false)
  const [streamingMessage, setStreamingMessage] = useState<ChatRoomMessageData | null>(null)
  const [awaitingResponse, setAwaitingResponse] = useState<boolean>(false)
  const { mutate: sendMessage } = useSendMessageMutation()

  const { data: activeChatRoom } = useCurrentChatRoomQuery()
  const { mutate: upgradeChatRoom } = useUpgradeChatRoomMutation()
  const activeChatRoomIdRef = useRef<number | undefined>(activeChatRoom?.chatRoomId)

  const setActiveChatRoomId = useCallback((chatRoomId?: number) => {
    if (!chatRoomId) return
    activeChatRoomIdRef.current = chatRoomId
  }, [])

  const isAscending = (list?: ChatRoomMessageData[]) => {
    if (!list || list.length < 2) return true
    const firstItem = list[0]
    const lastItem = list[list.length - 1]
    const first = firstItem?.createdAt ? new Date(firstItem.createdAt).getTime() : 0
    const last = lastItem?.createdAt ? new Date(lastItem.createdAt).getTime() : 0
    return first <= last
  }
  const getTargetPageIndex = (pages: Array<{ list?: ChatRoomMessageData[] }>) => {
    if (pages.length === 0) return 0
    const ascending = isAscending(pages[0]?.list)
    return ascending ? pages.length - 1 : 0
  }

  const handleChatResponse = useCallback(
    (chunk: string) => {
      const activeChatRoomId = activeChatRoomIdRef.current ?? activeChatRoom?.chatRoomId
      if (!activeChatRoomId) return

      if (chunk.startsWith(TERMINATION_MESSAGE_START)) {
        setAwaitingResponse(false)
        const queryKey = chatService.chatMessagesQuery(activeChatRoomId).queryKey

        const terminationMessage: ChatRoomMessageData = {
          messageId: Date.now(),
          content: chunk,
          createdAt: new Date().toISOString(),
          senderType: ChatRoomMessageDataSenderTypeEnum.Assistant,
        }

        // streamingMessage 상태를 건너뛰고 react-query 캐시에 직접 저장
        queryClient.setQueryData<InfiniteData<BaseListSwaggerResponseChatRoomMessageData>>(queryKey, (oldData) => {
          if (!oldData) return oldData

          const newData = { ...oldData, pages: [...oldData.pages] }
          if (newData.pages.length > 0) {
            const targetIndex = getTargetPageIndex(newData.pages)
            const targetPage = { ...newData.pages[targetIndex], list: [...(newData.pages[targetIndex]?.list ?? [])] }
            if (isAscending(targetPage.list)) {
              targetPage.list.push(terminationMessage)
            } else {
              targetPage.list.unshift(terminationMessage)
            }
            newData.pages[targetIndex] = targetPage
          } else {
            newData.pages.push({ list: [terminationMessage], page: 0, size: 1, totalCount: 1 })
          }
          return newData
        })

        // 다른 스트리밍 관련 상태는 확실하게 초기화
        setStreamingMessage(null)
        return // 여기서 함수 실행 종료
      }

      // 기존의 일반 스트리밍 메시지 처리 로직
      setAwaitingResponse(false)
      setStreamingMessage((prev) => {
        const baseMessage = {
          messageId: prev?.messageId || Date.now(),
          createdAt: prev?.createdAt || new Date().toISOString(),
          senderType: ChatRoomMessageDataSenderTypeEnum.Assistant,
        }
        return { ...baseMessage, content: (prev?.content || '') + chunk }
      })
    },
    [activeChatRoom?.chatRoomId, queryClient]
  )

  const handleResponseId = useCallback(
    (messageIds: number[]) => {
      const activeChatRoomId = activeChatRoomIdRef.current ?? activeChatRoom?.chatRoomId
      if (!activeChatRoomId) return
      const queryKey = chatService.chatMessagesQuery(activeChatRoomId).queryKey

      const sanitizedIds = messageIds.filter((id) => Number.isFinite(id))
      const messageGroups = groupSentences(streamingMessage?.content ?? '', 3)
      const canApply = !!streamingMessage && sanitizedIds.length > 0 && sanitizedIds.length === messageGroups.length

      let didCommit = false
      if (canApply) {
        queryClient.setQueryData<InfiniteData<BaseListSwaggerResponseChatRoomMessageData>>(queryKey, (oldData) => {
          if (!oldData || !streamingMessage) return oldData

          const groupedMessages = messageGroups.map((content, index) => ({
            messageId: sanitizedIds[index]!,
            content,
            createdAt: streamingMessage.createdAt,
            senderType: ChatRoomMessageDataSenderTypeEnum.Assistant,
          }))

          const orderedMessages = isAscending(oldData.pages[0]?.list) ? groupedMessages : [...groupedMessages].reverse()

          const newData = {
            ...oldData,
            pages: oldData.pages.map((page, index) => {
              const targetIndex = getTargetPageIndex(oldData.pages)
              if (index === targetIndex) {
                const newList = page.list
                  ? isAscending(page.list)
                    ? [...page.list, ...orderedMessages]
                    : [...orderedMessages, ...page.list]
                  : orderedMessages
                return { ...page, list: newList }
              }
              return { ...page, list: [...(page.list || [])] }
            }),
          }
          didCommit = true
          return newData
        })
      }

      if (didCommit) {
        setStreamingMessage(null)
      }
      setSendingMessage(false)
      setAwaitingResponse(false)
    },
    [activeChatRoom?.chatRoomId, queryClient, streamingMessage]
  )

  const handleLevelFinished = useCallback(() => {
    upgradeChatRoom()
  }, [upgradeChatRoom])

  const { reconnect, disconnect } = useSSESubscription('chat', {
    onChatResponse: handleChatResponse,
    onResponseId: handleResponseId,
    onLevelFinished: handleLevelFinished,
    onError: useCallback(() => {
      setSendingMessage(false)
      setAwaitingResponse(false)
      setStreamingMessage(null)
    }, []),
  })

  const sendMessageWithReconnect = useCallback(
    async (message: string, targetChatRoomId?: number) => {
      try {
        setSendingMessage(true)
        setAwaitingResponse(true)
        setStreamingMessage(null)

        // 1. 기존 SSE 연결 종료
        disconnect()

        // 2. 새로운 SSE 연결 및 완료 대기
        await reconnect()

        // 3. 연결 완료 후 메시지 전송
        const chatRoomId = targetChatRoomId ?? activeChatRoom?.chatRoomId
        if (!chatRoomId) {
          setSendingMessage(false)
          setAwaitingResponse(false)
          return
        }
        activeChatRoomIdRef.current = chatRoomId

        sendMessage(
          { chatRoomId, message },
          {
            onError: () => {
              setSendingMessage(false)
              setAwaitingResponse(false)
              setStreamingMessage(null)
            },
          }
        )
      } catch (error) {
        console.error('Failed to reconnect and send message:', error)
        setSendingMessage(false) // 에러 발생 시 전송 상태 해제
        setAwaitingResponse(false)
        setStreamingMessage(null)
      }
    },
    [activeChatRoom?.chatRoomId, disconnect, reconnect, sendMessage]
  )

  return (
    <ChattingContext.Provider
      value={{
        sendingMessage,
        streamingMessage,
        awaitingResponse,
        sendMessageWithReconnect,
        setActiveChatRoomId,
      }}
    >
      {children}
    </ChattingContext.Provider>
  )
}

export function useChatting() {
  const context = useContext(ChattingContext)
  if (context === undefined) {
    throw new Error('useChatting must be used within a ChattingProvider')
  }
  return context
}
