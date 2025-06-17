import { AuthContext, useAuth } from '@/shared/libs/auth'
import { QueryClient } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createRootRouteWithContext, Outlet, redirect, useRouter } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { match } from 'path-to-regexp'

interface RouterContext {
  queryClient: QueryClient
  auth: AuthContext
}

const publicRoutes = ['/']
const noAuthRoutes = ['/auth', '/register', '/register/user', '/register/business']

function matchRoute(routes: string[], path: string) {
  return routes.some((route) => match(route)(path))
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
  beforeLoad: async ({ context, location }) => {
    const authenticated = context.auth.authenticated
    const pathname = location.pathname

    if (authenticated && matchRoute(noAuthRoutes, pathname)) return redirect({ to: '/' })
    if (!authenticated && !(matchRoute(publicRoutes, pathname) || matchRoute(noAuthRoutes, pathname))) {
      return redirect({ to: '/auth', search: { redirect: pathname } })
    }
  },
})

function RootComponent() {
  const navigate = Route.useNavigate()
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    await router.invalidate()
    await navigate({ to: '/auth' })
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="mx-auto flex w-full flex-1 justify-center">
        <Outlet />
      </main>
      <TanStackRouterDevtools position="bottom-right" />
      <ReactQueryDevtools buttonPosition="bottom-left" />
    </div>
  )
}
