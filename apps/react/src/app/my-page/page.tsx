import bridge from '@/shared/bridge'
import { Button } from '@/shared/ui'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/my-page/')({
  component: MyPageComponent,
})

function MyPageComponent() {
  return (
    <div>
      <Button text="Logout" onClick={async () => await bridge.logout()} />
    </div>
  )
}
