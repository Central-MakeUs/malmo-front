import { ChattingProvider, useChatting } from '@/features/chat/context/chatting-context'
import { useChattingModal } from '@/features/chat/hook/use-chatting-modal'
import { DetailHeaderBar } from '@/shared/components/header-bar'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { cn } from '@ui/common/lib/utils'

export const Route = createFileRoute('/chat')({
  component: RouteComponent,
})

function ChatLayout() {
  const { showChattingTutorial } = useChattingModal()

  return (
    <div className={cn('flex h-screen flex-col', { 'mt-3': showChattingTutorial })}>
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
