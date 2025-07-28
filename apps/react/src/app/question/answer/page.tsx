import { DetailHeaderBar } from '@/shared/components/header-bar'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/question/answer/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <DetailHeaderBar title="답변 작성" />
    </div>
  )
}
