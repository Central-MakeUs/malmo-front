import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/chat/')({
  component: Chat,
})

function Chat() {
  return <div className="m-auto text-2xl font-bold">채팅</div>
}
