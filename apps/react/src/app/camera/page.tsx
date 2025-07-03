import { TestApi } from '@data/user-api-axios/api'
import { createFileRoute } from '@tanstack/react-router'

const testApi = new TestApi()

export const Route = createFileRoute('/camera/')({
  component: Camera,
  loader: async () => {
    return { data: await testApi.test() }
  },
})

function Camera() {
  const { data } = Route.useLoaderData()
  console.log('Test data:', data)
  return <div className="m-auto text-2xl font-bold">카메라</div>
}
