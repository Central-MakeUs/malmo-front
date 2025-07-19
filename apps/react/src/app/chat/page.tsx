import { AiChatBubble, MyChatBubble } from '@/features/chat/components/chat-bubble'
import ChatInput from '@/features/chat/components/chat-input'
import { DateDivider } from '@/features/chat/components/date-divider'
import { useChatting } from '@/features/chat/context/chatting-context'
import { formatTimestamp } from '@/features/chat/util/chat-format'
import bridge from '@/shared/bridge'
import { useAlertDialog } from '@/shared/hook/alert-dialog.hook'
import { createFileRoute } from '@tanstack/react-router'
import React from 'react'

export const Route = createFileRoute('/chat/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data } = useChatting()
  const alertDialog = useAlertDialog()

  return (
    <div className="flex h-full flex-col">
      <section className="flex-1 overflow-y-auto">
        <button
          onClick={() => {
            alertDialog.open({ title: 'Test', description: 'This is a test.' })
          }}
        >
          dialog 팝업하기
        </button>
        <div className="bg-gray-iron-700 px-[20px] py-[9px]">
          <p className="body3-medium text-white">상담 내용은 상대에게 공유 또는 유출되지 않으니 안심하세요!</p>
        </div>

        <div className="space-y-5 px-5 py-6">
          {data.chat.map((chat, index) => {
            // 이전 메시지의 타임스탬프를 가져옵니다. 첫 번째 메시지인 경우 undefined입니다.
            const previousTimestamp = index > 0 ? chat[index - 1]?.timestamp : undefined

            return (
              <React.Fragment key={chat.id}>
                <DateDivider currentTimestamp={chat.timestamp} previousTimestamp={previousTimestamp} />

                {chat.sendType === 'ai' ? (
                  <AiChatBubble message={chat.message} timestamp={formatTimestamp(chat.timestamp)} />
                ) : (
                  <MyChatBubble message={chat.message} timestamp={formatTimestamp(chat.timestamp)} />
                )}
              </React.Fragment>
            )
          })}
        </div>
      </section>

      <ChatInput />
    </div>
  )
}
