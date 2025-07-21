import { ChattingProvider, useChatting } from '@/features/chat/context/chatting-context'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { cn } from '@ui/common/lib/utils'

export const Route = createFileRoute('/chat')({
  component: RouteComponent,
})

function ChatLayout() {
  const { chattingModal } = useChatting()

  return (
    <div className={cn('flex h-screen flex-col', { 'pt-3': chattingModal.showChattingTutorial })}>
      <Outlet />
    </div>
  )
}

function RouteComponent() {
  return (
    <ChattingProvider>
      <ChatLayout />
    </ChattingProvider>
  )
}
