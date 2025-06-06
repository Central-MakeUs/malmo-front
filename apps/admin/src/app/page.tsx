import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  beforeLoad: ({ context }) => {
    if (context.auth.authenticated) {
      throw redirect({ to: '/contents' })
    } else {
      throw redirect({ to: '/auth' })
    }
  },
})
