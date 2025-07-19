import { ChattingProvider, useChatting } from '@/features/chat/context/chatting-context'
import { DetailHeaderBar } from '@/shared/components/header-bar'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { useCallback } from 'react'

export const Route = createFileRoute('/chat')({
  component: RouteComponent,
})

function ChatLayout() {
  const { exitButton } = useChatting()

  return (
    <div className="flex h-screen flex-col">
      <DetailHeaderBar right={exitButton()} />

      <div className="min-h-0 flex-1">
        <Outlet />
      </div>
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
