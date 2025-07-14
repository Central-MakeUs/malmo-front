import { AuthContext } from '@/features/auth/hooks/use-auth'
import { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Outlet, redirect } from '@tanstack/react-router'
import { match } from 'path-to-regexp'

interface RouterContext {
  queryClient: QueryClient
  auth: AuthContext
}

const publicRoutes = ['/login', '/intro']

function matchRoute(routes: string[], path: string) {
  return routes.some((route) => match(route)(path))
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
  beforeLoad: async ({ context, location }) => {
    const authenticated = context.auth.authenticated
    const pathname = location.pathname

    // 인증되지 않은 사용자는 퍼블릭 경로만 접근 가능
    if (!authenticated && !matchRoute(publicRoutes, pathname)) {
      return redirect({ to: '/login' })
    }

    // 인증된 사용자가 로그인 페이지로 접근하면 홈으로 리다이렉트
    if (authenticated && pathname === '/login') {
      return redirect({ to: '/' })
    }
  },
})

function RootComponent() {
  return (
    <div className="bg-gray-09 flex min-h-screen w-full flex-col">
      <main className="relative mx-auto flex min-h-screen w-full max-w-[600px] flex-col bg-white">
        <Outlet />
      </main>
    </div>
  )
}
