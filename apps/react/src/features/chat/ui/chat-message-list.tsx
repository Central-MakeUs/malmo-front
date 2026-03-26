import { ChatRoomMessageData, ChatRoomMessageDataSenderTypeEnum } from '@data/user-api-axios/api'
import React from 'react'

import { ChatMessageTempStatus } from '@/features/chat/hooks/use-chat-queries'
import { AiChatBubble, MyChatBubble } from '@/features/chat/ui/chat-bubble'
import { DateDivider } from '@/features/chat/ui/date-divider'
import { formatTimestamp, isSameTimestampMinute } from '@/features/chat/util/chat-format'
import { cn } from '@/shared/lib/cn'

type ChatMessageListProps = {
  messages: ChatRoomMessageData[]
  chatId?: number
  resolvedChatRoomId?: number
  isLoading: boolean
  hasNextPage?: boolean
  isFetchingNextPage: boolean
  infiniteScrollRef?: React.Ref<HTMLDivElement>
  awaitingResponse: boolean
  streamingMessage: ChatRoomMessageData | null
  onRetry: (content: string) => void
}

const LoadingIndicator = React.forwardRef<HTMLDivElement, { isFetching: boolean }>(({ isFetching }, ref) => (
  <div ref={ref} className="flex h-12 items-center justify-center">
    {isFetching && <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-500" />}
  </div>
))
LoadingIndicator.displayName = 'LoadingIndicator'

const shouldShowMessageTimestamp = (currentMessage: ChatRoomMessageData, nextMessage?: ChatRoomMessageData) => {
  if (!currentMessage.createdAt) return false
  if (!nextMessage?.createdAt) return true

  return (
    currentMessage.senderType !== nextMessage.senderType ||
    !isSameTimestampMinute(currentMessage.createdAt, nextMessage.createdAt)
  )
}

export function ChatMessageList({
  messages,
  chatId,
  resolvedChatRoomId,
  isLoading,
  hasNextPage,
  isFetchingNextPage,
  infiniteScrollRef,
  awaitingResponse,
  streamingMessage,
  onRetry,
}: ChatMessageListProps) {
  const shouldShowInfiniteLoader = !!hasNextPage

  return (
    <div className="flex flex-1 flex-col">
      <section className="no-bounce-scroll flex flex-1 flex-col overflow-y-auto">
        <div className="bg-gray-iron-700 px-[20px] py-[9px]">
          <p className="body3-medium text-center text-white">대화 내용은 암호화 되어 안전하게 저장하고 있어요!</p>
        </div>

        {isLoading && (
          <div className="flex flex-1 items-center justify-center">
            <LoadingIndicator isFetching={true} />
          </div>
        )}

        {!chatId && shouldShowInfiniteLoader && (
          <LoadingIndicator ref={infiniteScrollRef} isFetching={isFetchingNextPage} />
        )}

        <div className="flex flex-col px-5 py-[22px]">
          {messages.map((chat, index) => {
            const previousTimestamp = index > 0 ? messages[index - 1]?.createdAt : undefined
            const previousSender = index > 0 ? messages[index - 1]?.senderType : undefined
            const nextMessage = index < messages.length - 1 ? messages[index + 1] : undefined
            const showHeader =
              chat.senderType === ChatRoomMessageDataSenderTypeEnum.Assistant &&
              previousSender !== ChatRoomMessageDataSenderTypeEnum.Assistant
            const isContinuous = previousSender === chat.senderType
            const showTimestamp = shouldShowMessageTimestamp(chat, nextMessage)
            const bookmarkId = chat.bookmarkId ?? null
            return (
              <div
                key={`${chat.messageId ?? 'temp'}-${chat.createdAt ?? 'no-time'}-${index}`}
                data-message-id={chat.messageId ?? undefined}
                className={cn('mt-6', {
                  'mt-0': index === 0,
                  'mt-5': isContinuous,
                })}
              >
                <DateDivider currentTimestamp={chat.createdAt} previousTimestamp={previousTimestamp} />
                {chat.senderType === ChatRoomMessageDataSenderTypeEnum.Assistant ? (
                  <AiChatBubble
                    messageId={chat.messageId}
                    chatRoomId={resolvedChatRoomId}
                    message={chat.content}
                    timestamp={formatTimestamp(chat.createdAt)}
                    showTimestamp={showTimestamp}
                    bookmarkId={bookmarkId}
                    showHeader={showHeader}
                  />
                ) : chat.senderType === ChatRoomMessageDataSenderTypeEnum.System ? (
                  <AiChatBubble
                    messageId={chat.messageId}
                    chatRoomId={resolvedChatRoomId}
                    message={chat.content}
                    timestamp={formatTimestamp(chat.createdAt)}
                    showTimestamp={showTimestamp}
                    bookmarkId={bookmarkId}
                  />
                ) : (
                  <MyChatBubble
                    messageId={chat.messageId}
                    chatRoomId={resolvedChatRoomId}
                    message={chat.content}
                    timestamp={formatTimestamp(chat.createdAt)}
                    showTimestamp={showTimestamp}
                    status={(chat as ChatRoomMessageData & ChatMessageTempStatus).status ?? 'sent'}
                    bookmarkId={bookmarkId}
                    onRetry={() => onRetry(chat.content!)}
                  />
                )}
              </div>
            )
          })}

          {awaitingResponse && !streamingMessage && (
            <div
              className={cn('mt-6', {
                'mt-5': messages[messages.length - 1]?.senderType === ChatRoomMessageDataSenderTypeEnum.Assistant,
              })}
            >
              <AiChatBubble isTyping />
            </div>
          )}

          {streamingMessage && (
            <div
              className={cn('mt-6', {
                'mt-5': messages[messages.length - 1]?.senderType === ChatRoomMessageDataSenderTypeEnum.Assistant,
              })}
            >
              <AiChatBubble
                messageId={streamingMessage.messageId}
                chatRoomId={resolvedChatRoomId}
                message={streamingMessage.content}
                timestamp={formatTimestamp(streamingMessage.createdAt)}
                bookmarkId={streamingMessage.bookmarkId ?? null}
                showHeader={messages[messages.length - 1]?.senderType !== ChatRoomMessageDataSenderTypeEnum.Assistant}
              />
            </div>
          )}
        </div>

        {chatId && shouldShowInfiniteLoader && (
          <LoadingIndicator ref={infiniteScrollRef} isFetching={isFetchingNextPage} />
        )}
      </section>
    </div>
  )
}
