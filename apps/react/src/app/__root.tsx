import { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Outlet, redirect } from '@tanstack/react-router'
import { match } from 'path-to-regexp'

import { AuthContext } from '@/features/auth/hooks/use-auth'
import { useTheme } from '@/shared/contexts/theme.context'

interface RouterContext {
  queryClient: QueryClient
  auth: AuthContext
}

// 공개 경로 (인증 불필요)
const publicRoutes = ['/login', '/intro', '/terms/privacy-policy']

// 온보딩 경로
const onboardingRoutes = [
  '/onboarding/terms',
  '/onboarding/nickname',
  '/onboarding/anniversary',
  '/onboarding/my-code',
  '/onboarding/partner-code',
  '/onboarding/complete',
]

function matchRoute(routes: string[], path: string) {
  return routes.some((route) => match(route)(path))
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
  beforeLoad: async ({ context, location }) => {
    const { authenticated, needsOnboarding } = context.auth
    const pathname = location.pathname

    // --- 인증 기반 라우팅 규칙 ---
    const isOnLoginRoute = pathname === '/login'
    const isOnOnboardingRoute = matchRoute(onboardingRoutes, pathname)

    // 1. 인증된 사용자
    if (authenticated) {
      // 규칙 1: 인증된 사용자가 로그인 페이지 접근 시, 온보딩 또는 홈으로 리다이렉트
      if (isOnLoginRoute) {
        throw redirect({ to: needsOnboarding ? '/onboarding/terms' : '/' })
      }
      // 규칙 2: 온보딩이 필요한데 온보딩 경로가 아니면, 온보딩으로 리다이렉트
      if (needsOnboarding && !isOnOnboardingRoute) {
        throw redirect({ to: '/onboarding/terms' })
      }
      // 규칙 3: 온보딩을 마쳤는데 온보딩 경로로 접근 시, 홈으로 리다이렉트
      if (!needsOnboarding && isOnOnboardingRoute) {
        throw redirect({ to: '/' })
      }
      return // 모든 규칙 통과 시 접근 허용
    }

    // 2. 미인증 사용자
    if (!authenticated) {
      // 루트('/') 진입 시에는 인트로로 유도
      if (pathname === '/') {
        throw redirect({ to: '/intro' })
      }
      // 비공개 경로 접근 시에는 로그인으로 유도
      if (!matchRoute(publicRoutes, pathname)) {
        throw redirect({ to: '/login' })
      }
    }
  },
})

function RootComponent() {
  const { statusColor } = useTheme()
  return (
    <div className="no-bounce-scroll main-scrollable app-safe flex h-screen w-full flex-col bg-white">
      <main className="relative mx-auto flex w-full max-w-[600px] flex-1 flex-col">
        <div
          aria-hidden
          className={'pointer-events-none fixed inset-x-0 top-0 z-40'}
          style={{ height: 'var(--safe-top)', backgroundColor: statusColor }}
        />
        <Outlet />
      </main>
    </div>
  )
}
