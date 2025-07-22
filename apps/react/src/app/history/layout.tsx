import { ChatHistoryProvider } from '@/features/history/context/chat-history-context'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/history')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <ChatHistoryProvider>
      <Outlet />
    </ChatHistoryProvider>
  )
}
