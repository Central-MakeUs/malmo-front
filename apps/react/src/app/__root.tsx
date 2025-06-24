import { bridge } from '@/app'
import { NavgationIcon } from '@/shared/components/navigation'
import { AuthContext, useAuth } from '@/shared/libs/auth'
import { QueryClient } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createRootRouteWithContext, Link, Outlet, redirect, useRouter } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { useBridge } from '@webview-bridge/react'
import { Bot, Camera, Home, Map, PersonStanding, User } from 'lucide-react'
import { match } from 'path-to-regexp'
import React from 'react'

interface RouterContext {
  queryClient: QueryClient
  auth: AuthContext
}

const publicRoutes = ['/', '/camera', '/chat', '/map']
const noAuthRoutes = ['/auth', '/register']

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
  const { user, logout, authenticated } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    await router.invalidate()
    await navigate({ to: '/auth' })
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-09">
      <main className="mx-auto flex h-full w-full max-w-[600px] flex-1 bg-white">
        <Outlet />
      </main>

      <footer className="fixed bottom-0 z-10 w-full">
        <nav
          className="mx-auto flex w-full max-w-[600px] justify-around rounded-t-4xl bg-white p-4"
          style={{
            boxShadow: '0px -5px 10px rgba(0, 0, 0, 0.03)',
            borderTop: '1px solid rgba(0, 0, 0, 0.03)',
          }}
        >
          <NavgationIcon icon={Home} text="홈" url="/" />
          <NavgationIcon icon={Camera} text="카메라" url="/camera" />
          <NavgationIcon icon={Bot} text="채팅" url="/chat" />
          <NavgationIcon icon={Map} text="지도" url="/map" />
          <NavgationIcon icon={User} text="마이페이지" url={'/mypage'} />
        </nav>
      </footer>
      <TanStackRouterDevtools position="bottom-right" />
      <ReactQueryDevtools buttonPosition="bottom-left" />
    </div>
  )
}
