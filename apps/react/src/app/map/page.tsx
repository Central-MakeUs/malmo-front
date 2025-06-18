import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/map/')({
  component: Map,
})

function Map() {
  return <div className="m-auto text-2xl font-bold">지도</div>
}
