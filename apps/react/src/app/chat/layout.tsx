import { DetailHeaderBar } from '@/shared/components/header-bar'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/chat')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex h-screen flex-col">
      <DetailHeaderBar right={<p className="body2-medium text-malmo-rasberry-500">종료하기</p>} />

      <div className="min-h-0 flex-1">
        <Outlet />
      </div>
    </div>
  )
}
