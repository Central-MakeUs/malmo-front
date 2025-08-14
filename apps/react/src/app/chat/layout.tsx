import { createFileRoute, Outlet } from '@tanstack/react-router'
import { useBridge } from '@webview-bridge/react'

import { ChattingProvider, useChatting } from '@/features/chat/context/chatting-context'
import bridge from '@/shared/bridge'
import { cn } from '@/shared/lib/cn'

export const Route = createFileRoute('/chat')({
  component: RouteComponent,
})

function ChatLayout() {
  const { chattingModal } = useChatting()
  const keyboardHeight = useBridge(bridge.store, (state) => state.keyboardHeight)

  return (
    <div
      className={cn('h-screen transition-[padding-bottom] duration-[250ms] ease-[cubic-bezier(0.17,0.59,0.4,0.77)]', {
        'pt-3': chattingModal.showChattingTutorial,
      })}
      style={{
        paddingBottom: keyboardHeight ? `calc(${keyboardHeight}px + var(--safe-bottom))` : `var(--safe-bottom)`,
      }}
    >
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
