import { ChatRoomMessageData, ChatRoomMessageDataSenderTypeEnum } from '@data/user-api-axios/api'
import { Link } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'
import React from 'react'

import { ChatMessageTempStatus } from '@/features/chat/hooks/use-chat-queries'
import { AiChatBubble, MyChatBubble } from '@/features/chat/ui/chat-bubble'
import { DateDivider } from '@/features/chat/ui/date-divider'
import { formatTimestamp } from '@/features/chat/util/chat-format'
import { wrapWithTracking } from '@/shared/analytics'
import { BUTTON_NAMES, CATEGORIES } from '@/shared/analytics/constants'
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

const ATTACHMENT_PROMPT_MESSAGE =
  '잠깐! 애착유형 테스트를 하면, 더 정확한 상담이 가능해! 그대로 진행하면 바로 상담해줄게'

const isAttachmentPromptMessage = (message?: ChatRoomMessageData | null) =>
  message?.senderType === ChatRoomMessageDataSenderTypeEnum.System && message.content === ATTACHMENT_PROMPT_MESSAGE

function AttachmentTestCta() {
  return (
    <div className="mt-3">
      <Link
        to="/attachment-test"
        search={{ from: '/chat' }}
        className="block"
        onClick={wrapWithTracking(BUTTON_NAMES.GO_ATTACHMENT_TEST, CATEGORIES.CHAT, () => {})}
      >
        <div className="flex w-fit items-center justify-between rounded-[8px] border border-gray-iron-300 bg-white py-2 pr-3 pl-[18px]">
          <span className="body3-semibold text-gray-iron-800">애착유형 테스트하러가기</span>
          <ChevronRight className="h-4 w-4" />
        </div>
      </Link>
    </div>
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
            const bookmarkId = chat.bookmarkId ?? null
            const isAttachmentPrompt = isAttachmentPromptMessage(chat)
            const isLastMessage = index === messages.length - 1
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
                    bookmarkId={bookmarkId}
                    showHeader={showHeader}
                  />
                ) : chat.senderType === ChatRoomMessageDataSenderTypeEnum.System ? (
                  <AiChatBubble
                    messageId={chat.messageId}
                    chatRoomId={resolvedChatRoomId}
                    message={chat.content}
                    timestamp={formatTimestamp(chat.createdAt)}
                    bookmarkId={bookmarkId}
                  />
                ) : (
                  <MyChatBubble
                    messageId={chat.messageId}
                    chatRoomId={resolvedChatRoomId}
                    message={chat.content}
                    timestamp={formatTimestamp(chat.createdAt)}
                    status={(chat as ChatRoomMessageData & ChatMessageTempStatus).status ?? 'sent'}
                    bookmarkId={bookmarkId}
                    onRetry={() => onRetry(chat.content!)}
                  />
                )}
                {isAttachmentPrompt && isLastMessage && (
                  <div className="pl-[62px]">
                    <AttachmentTestCta />
                  </div>
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
