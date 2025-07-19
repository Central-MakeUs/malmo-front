import { ChattingProvider, useChatting } from '@/features/chat/context/chatting-context'
import { useChattingModal } from '@/features/chat/hook/use-chatting-modal'
import { DetailHeaderBar } from '@/shared/components/header-bar'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/chat')({
  component: RouteComponent,
})

function ChatLayout() {
  const { exitButton } = useChatting()
  const { exitChattingModal } = useChattingModal()

  return (
    <div className="mt-3 flex h-screen flex-col">
      <DetailHeaderBar
        right={exitButton()}
        onBackClick={() => {
          exitChattingModal()
        }}
      />

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
