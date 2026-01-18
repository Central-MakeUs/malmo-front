import {
  ChatRoomMessageData,
  ChatRoomMessageDataSenderTypeEnum,
  ChatRoomStateDataChatRoomStateEnum,
} from '@data/user-api-axios/api'
import { Link } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'
import React from 'react'

import { ChatMessageTempStatus } from '@/features/chat/hooks/use-chat-queries'
import { AiChatBubble, MyChatBubble } from '@/features/chat/ui/chat-bubble'
import { DateDivider } from '@/features/chat/ui/date-divider'
import { formatTimestamp } from '@/features/chat/util/chat-format'
import { cn } from '@/shared/lib/cn'

type ChatMessageListProps = {
  messages: ChatRoomMessageData[]
  chatId?: number
  chatStatus?: ChatRoomStateDataChatRoomStateEnum
  resolvedChatRoomId?: number
  isLoading: boolean
  hasNextPage?: boolean
  isFetchingNextPage: boolean
  infiniteScrollRef?: React.Ref<HTMLDivElement>
  awaitingResponse: boolean
  streamingMessage: ChatRoomMessageData | null
  onRetry: (content: string) => void
  onGoMyPage?: () => void
}

const LoadingIndicator = React.forwardRef<HTMLDivElement, { isFetching: boolean }>(({ isFetching }, ref) => (
  <div ref={ref} className="flex h-12 items-center justify-center">
    {isFetching && <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-500" />}
  </div>
))
LoadingIndicator.displayName = 'LoadingIndicator'

export function ChatMessageList({
  messages,
  chatId,
  chatStatus,
  resolvedChatRoomId,
  isLoading,
  hasNextPage,
  isFetchingNextPage,
  infiniteScrollRef,
  awaitingResponse,
  streamingMessage,
  onRetry,
  onGoMyPage,
}: ChatMessageListProps) {
  const shouldShowInfiniteLoader = !!hasNextPage

  return (
    <div className="flex flex-1 flex-col">
      <section className="no-bounce-scroll flex flex-1 flex-col overflow-y-auto">
        <div className="bg-gray-iron-700 px-[20px] py-[9px]">
          <p className="body3-medium text-center text-white">
            연동 후에도 대화 내용은 상대에게 공유되지 않으니 안심하세요!
          </p>
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
            const showHeader =
              chat.senderType === ChatRoomMessageDataSenderTypeEnum.Assistant &&
              previousSender !== ChatRoomMessageDataSenderTypeEnum.Assistant
            const isContinuous = previousSender === chat.senderType
            return (
              <div
                key={`${chat.messageId}-${index}`}
                data-message-id={chat.messageId}
                className={cn('mt-6', {
                  'mt-0': index === 0,
                  'mt-2': isContinuous,
                })}
              >
                <DateDivider currentTimestamp={chat.createdAt} previousTimestamp={previousTimestamp} />
                {chat.senderType === ChatRoomMessageDataSenderTypeEnum.Assistant ? (
                  <AiChatBubble
                    messageId={chat.messageId}
                    chatRoomId={resolvedChatRoomId}
                    message={chat.content}
                    timestamp={formatTimestamp(chat.createdAt)}
                    isSaved={chat.saved}
                    showHeader={showHeader}
                  />
                ) : (
                  <MyChatBubble
                    messageId={chat.messageId}
                    chatRoomId={resolvedChatRoomId}
                    message={chat.content}
                    timestamp={formatTimestamp(chat.createdAt)}
                    status={(chat as ChatRoomMessageData & ChatMessageTempStatus).status ?? 'sent'}
                    isSaved={chat.saved}
                    onRetry={() => onRetry(chat.content!)}
                  />
                )}
              </div>
            )
          })}

          {awaitingResponse && !streamingMessage && (
            <div
              className={cn('mt-6', {
                'mt-2': messages[messages.length - 1]?.senderType === ChatRoomMessageDataSenderTypeEnum.Assistant,
              })}
            >
              <AiChatBubble isTyping />
            </div>
          )}

          {streamingMessage && (
            <div
              className={cn('mt-6', {
                'mt-2': messages[messages.length - 1]?.senderType === ChatRoomMessageDataSenderTypeEnum.Assistant,
              })}
            >
              <AiChatBubble
                messageId={streamingMessage.messageId}
                chatRoomId={resolvedChatRoomId}
                message={streamingMessage.content}
                timestamp={formatTimestamp(streamingMessage.createdAt)}
                isSaved={streamingMessage.saved}
                showHeader={messages[messages.length - 1]?.senderType !== ChatRoomMessageDataSenderTypeEnum.Assistant}
              />
            </div>
          )}

          {chatStatus === ChatRoomStateDataChatRoomStateEnum.Paused && (
            <Link
              to="/my-page"
              className="mt-[-12px] ml-[62px] flex w-fit items-center gap-1 rounded-[8px] border border-malmo-rasberry-300 py-2 pr-[12px] pl-[18px] text-malmo-rasberry-500 shadow-[1px_3px_8px_rgba(0,0,0,0.08)]"
              onClick={onGoMyPage}
            >
              <p className="body3-semibold">마이페이지로 이동하기</p>
              <ChevronRight className="h-4 w-4" />
            </Link>
          )}
        </div>

        {chatId && shouldShowInfiniteLoader && (
          <LoadingIndicator ref={infiniteScrollRef} isFetching={isFetchingNextPage} />
        )}
      </section>
    </div>
  )
}
