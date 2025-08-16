import { createFileRoute, Outlet } from '@tanstack/react-router'

import { ChattingProvider } from '@/features/chat/context/chatting-context'

export const Route = createFileRoute('/chat')({
  component: RouteComponent,
})

function ChatLayout() {
  return (
    <div className={'h-full pb-[var(--safe-bottom)]'}>
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
