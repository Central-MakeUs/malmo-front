import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)/system/')({
  beforeLoad: () => {
    throw redirect({ to: '/system/administrators' })
  },
})
