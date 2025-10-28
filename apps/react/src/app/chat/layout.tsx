import { createFileRoute, Outlet } from '@tanstack/react-router'

import { ChattingProvider } from '@/features/chat/context/chatting-context'

export const Route = createFileRoute('/chat')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <ChattingProvider>
      <Outlet />
    </ChattingProvider>
  )
}
