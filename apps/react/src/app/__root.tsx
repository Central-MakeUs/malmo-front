import { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Outlet, redirect } from '@tanstack/react-router'
import { match } from 'path-to-regexp'
import { AuthContext } from '@/features/auth/hooks/use-auth'
import { MemberDataMemberStateEnum } from '@data/user-api-axios/api'

interface RouterContext {
  queryClient: QueryClient
  auth: AuthContext
}

// 인증이 필요 없는 공개 경로
const publicRoutes = ['/login', '/intro']

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
    const { authenticated, refreshUserInfo } = context.auth
    const pathname = location.pathname

    // 인증되지 않은 사용자는 퍼블릭 경로만 접근 가능
    if (!authenticated && !matchRoute(publicRoutes, pathname)) {
      return redirect({ to: '/login' })
    }

    if (authenticated) {
      // 최신 사용자 정보 조회
      const userInfo = await refreshUserInfo()
      const needsOnboarding = userInfo?.memberState === MemberDataMemberStateEnum.BeforeOnboarding

      // 인증된 사용자가 로그인 페이지에 접근하면 멤버 상태에 따라 리다이렉트
      if (pathname === '/login') {
        // 온보딩이 필요한 경우
        if (needsOnboarding) {
          return redirect({ to: '/onboarding/terms' })
        } else {
          // 온보딩이 완료된 경우
          return redirect({ to: '/' })
        }
      }

      // 인증된 사용자가 온보딩 경로가 아닌 페이지에 접근할 때 멤버 상태 확인
      if (!matchRoute(onboardingRoutes, pathname)) {
        // 온보딩이 필요한 상태인데 온보딩 경로가 아니면 온보딩으로 리다이렉트
        if (needsOnboarding) {
          return redirect({ to: '/onboarding/terms' })
        }
      }

      // 온보딩 경로에 접근했는데 온보딩이 필요하지 않으면 홈으로 리다이렉트
      if (matchRoute(onboardingRoutes, pathname) && !needsOnboarding) {
        return redirect({ to: '/' })
      }
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
