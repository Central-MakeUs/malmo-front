import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/chat/result/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Result</div>
}
