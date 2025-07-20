import { AiChatBubble, MyChatBubble } from '@/features/chat/components/chat-bubble'
import ChatInput from '@/features/chat/components/chat-input'
import { DateDivider } from '@/features/chat/components/date-divider'
import { useChatting } from '@/features/chat/context/chatting-context'
import { formatTimestamp } from '@/features/chat/util/chat-format'
import { DetailHeaderBar } from '@/shared/components/header-bar'
import { ChatRoomMessageDataSenderTypeEnum } from '@data/user-api-axios/api'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import React from 'react'
import { z } from 'zod'

const searchSchema = z.object({
  chatId: z.number().optional(),
})

export const Route = createFileRoute('/chat/')({
  component: RouteComponent,
  validateSearch: searchSchema,
  loaderDeps: (search) => search,
  loader: async ({ context, deps }) => {
    const { chatId } = deps.search
    return { chatId }
  },
})

function RouteComponent() {
  const { chatData } = useChatting()
  const { chatId } = Route.useLoaderData()
  const router = useRouter()
  const { exitButton, chattingModal } = useChatting()

  return (
    <div className="flex h-full flex-col">
      <DetailHeaderBar
        right={chatId ? undefined : exitButton()}
        title={chatId?.toString()}
        onBackClick={() => (chatId ? router.history.back() : chattingModal.exitChattingModal())}
      />

      <section className="flex-1 overflow-y-auto">
        <div className="bg-gray-iron-700 px-[20px] py-[9px]">
          <p className="body3-medium text-white">상담 내용은 상대에게 공유 또는 유출되지 않으니 안심하세요!</p>
        </div>

        <div className="space-y-5 px-5 py-6">
          {chatData?.map((chat, index) => {
            const previousTimestamp = index > 0 ? chatData[index - 1]?.createdAt : undefined

            return (
              <React.Fragment key={chat.messageId}>
                <DateDivider currentTimestamp={chat.createdAt} previousTimestamp={previousTimestamp} />

                {chat.senderType === ChatRoomMessageDataSenderTypeEnum.Assistant ? (
                  <AiChatBubble message={chat.content} timestamp={formatTimestamp(chat.createdAt)} />
                ) : (
                  <MyChatBubble message={chat.content} timestamp={formatTimestamp(chat.createdAt)} />
                )}
              </React.Fragment>
            )
          })}
        </div>
      </section>

      <ChatInput disabled={chatId !== undefined} />
      {chattingModal.showChattingTutorial && chattingModal.chattingTutorialModal()}
    </div>
  )
}
