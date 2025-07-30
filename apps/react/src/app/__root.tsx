import { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Outlet, redirect } from '@tanstack/react-router'
import { match } from 'path-to-regexp'
import { AuthContext } from '@/features/auth/hooks/use-auth'
import { MemberDataMemberStateEnum } from '@data/user-api-axios/api'
import bridge from '@/shared/bridge'

interface RouterContext {
  queryClient: QueryClient
  auth: AuthContext
}

// 인증이 필요 없는 공개 경로
const publicRoutes = ['/login', '/intro']

// intro가 필요 없는 경로
const introExemptRoutes = ['/intro']

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
    const { authenticated, userInfo } = context.auth
    const pathname = location.pathname

    // 0. 소개 페이지 확인
    // intro 페이지가 필요하지 않은 경로가 아닌 경우에만 확인
    if (!matchRoute(introExemptRoutes, pathname)) {
      try {
        const introSeen = await bridge.getIntroSeen()
        if (!introSeen) {
          return redirect({ to: '/intro' })
        }
      } catch (error) {
        // Todo: 오류 처리
      }
    }

    // 1. 비인증 사용자 처리 (가드 클로즈)
    // 인증되지 않은 경우, 공개된 경로가 아니면 로그인 페이지로 보냅니다.
    if (!authenticated) {
      if (!matchRoute(publicRoutes, pathname)) {
        return redirect({ to: '/login' })
      }
      // 공개된 경로라면 아무 작업 없이 통과시킵니다.
      return
    }

    // --- 이하 로직은 모두 '인증된 사용자'만 해당 ---
    // 2. 사용자 정보 및 현재 경로 상태 정의
    const needsOnboarding = userInfo?.memberState === MemberDataMemberStateEnum.BeforeOnboarding
    const isOnOnboardingRoute = matchRoute(onboardingRoutes, pathname)
    const isOnLoginRoute = pathname === '/login'
    // 3. 상태에 따른 리다이렉트 규칙 적용

    // 규칙 1: 로그인한 사용자가 로그인 페이지에 접근하면 안 됩니다.
    if (isOnLoginRoute) {
      return redirect({ to: needsOnboarding ? '/onboarding/terms' : '/' })
    }

    // 규칙 2: 온보딩이 필요한 사용자는 온보딩 페이지만 접근해야 합니다.
    if (needsOnboarding && !isOnOnboardingRoute) {
      return redirect({ to: '/onboarding/terms' })
    }

    // 규칙 3: 온보딩을 마친 사용자는 온보딩 페이지에 접근하면 안 됩니다.
    if (!needsOnboarding && isOnOnboardingRoute) {
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
