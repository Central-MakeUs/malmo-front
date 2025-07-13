import { AiChatBubble, MyChatBubble } from '@/features/chat/components/chat-bubble'
import ChatInput from '@/features/chat/components/chat-input'
import { DateDivider } from '@/features/chat/components/date-divider'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/chat/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <section className="flex flex-1 flex-col">
      <div className="flex-1 space-y-6 overflow-y-auto px-5 py-6">
        <DateDivider />
        <AiChatBubble />
        <MyChatBubble />
        <AiChatBubble />
        <MyChatBubble />
      </div>

      <ChatInput />
    </section>
  )
}
