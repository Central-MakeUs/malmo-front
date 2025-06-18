import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/camera/')({
  component: Camera,
})

function Camera() {
  return <div className="m-auto text-2xl font-bold">카메라</div>
}
