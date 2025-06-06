import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)')({
  component: AuthLayout,
})

function AuthLayout() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <Outlet />
    </div>
  )
}
