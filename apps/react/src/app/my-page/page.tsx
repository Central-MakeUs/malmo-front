import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/my-page/')({
  component: MyPageComponent,
})

function MyPageComponent() {
  return <div>MyPageComponent</div>
}
