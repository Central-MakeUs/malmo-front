import { AiChatBubble, MyChatBubble } from '@/features/chat/components/chat-bubble'
import ChatInput from '@/features/chat/components/chat-input'
import { DateDivider } from '@/features/chat/components/date-divider'
import { formatTimestamp } from '@/features/chat/util/chat-format'
import { createFileRoute } from '@tanstack/react-router'
import React from 'react'

export const Route = createFileRoute('/chat/')({
  component: RouteComponent,
})

function RouteComponent() {
  const chatExample = [
    {
      id: 1,
      message:
        'OO아 안녕! 나는 연애 갈등 상담사 모모야. 나와의 대화를 마무리하고 싶다면 종료하기 버튼을 눌러줘! 오늘은 어떤 고민 때문에 나를 찾아왔어? 먼저 연인과 있었던 갈등 상황을 이야기해 주면 내가 같이 고민해볼게!',
      sendType: 'ai',
      timestamp: '2023-10-01T21:56:00Z',
    },
    {
      id: 2,
      message: '같이 있으면 좋은데, 마음을 표현하는 방식이 너무 달라.. 나만 노력하고 있는 느낌이 들 때가 있어서 속상해',
      sendType: 'me',
      timestamp: '2023-10-01T21:58:00Z',
    },
    {
      id: 3,
      message:
        '아, 그런 상황이구나. 연인과의 마음 표현 방식이 다르면 갈등이 생길 수 있어. 그 사람 마음을 해석하고, 어떻게 하면 좋을지 알려줄게.',
      sendType: 'ai',
      timestamp: '2023-10-03T09:30:00Z',
    },
    {
      id: 4,
      message: '네 말이 맞아. 내가 너무 내 생각만 했나봐.',
      sendType: 'me',
      timestamp: '2023-10-03T09:32:00Z',
    },
  ]

  return (
    <div className="flex h-full flex-col">
      <section className="flex-1 overflow-y-auto">
        <div className="bg-gray-iron-700 px-[20px] py-[9px]">
          <p className="text-body-3 font-medium text-white">
            상담 내용은 상대에게 공유 또는 유출되지 않으니 안심하세요!
          </p>
        </div>

        <div className="space-y-5 px-5 py-6">
          {chatExample.map((chat, index) => {
            // 이전 메시지의 타임스탬프를 가져옵니다. 첫 번째 메시지인 경우 undefined입니다.
            const previousTimestamp = index > 0 ? chatExample[index - 1]?.timestamp : undefined

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
