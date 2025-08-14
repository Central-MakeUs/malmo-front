import { createFileRoute, Outlet } from '@tanstack/react-router'
import { useBridge } from '@webview-bridge/react'

import { ChattingProvider } from '@/features/chat/context/chatting-context'
import bridge from '@/shared/bridge'

export const Route = createFileRoute('/chat')({
  component: RouteComponent,
})

function ChatLayout() {
  const keyboardHeight = useBridge(bridge.store, (state) => state.keyboardHeight)

  return (
    <div
      className={'h-screen transition-[padding-bottom] duration-[250ms] ease-[cubic-bezier(0.17,0.59,0.4,0.77)]'}
      style={{
        paddingBottom: keyboardHeight
          ? `calc(${keyboardHeight}px + var(--safe-bottom) + var(--safe-top))`
          : `calc(var(--safe-bottom) + var(--safe-top))`,
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
