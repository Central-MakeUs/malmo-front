import { AuthContext } from '@/shared/libs/auth'
import { QueryClient } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createRootRouteWithContext, Outlet, redirect } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { match } from 'path-to-regexp'
import * as React from 'react'

interface RouterContext {
  queryClient: QueryClient
  auth: AuthContext
}

const publicRoutes = ['/']
const noAuthRoutes = ['/auth', '/auth/register']

function matchRoute(routes: string[], path: string) {
  return routes.some((route) => match(route)(path))
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
  beforeLoad: async ({ context, location }) => {
    const authenticated = context.auth.authenticated
    const pathname = location.pathname

    if (authenticated && matchRoute(noAuthRoutes, pathname)) throw redirect({ to: '/' })
    if (!authenticated && !(matchRoute(publicRoutes, pathname) || matchRoute(noAuthRoutes, pathname))) {
      throw redirect({ to: '/auth', search: { redirect: pathname } })
    }
  },
})

function RootComponent() {
  return (
    <>
      <Outlet />
      <TanStackRouterDevtools position="bottom-right" />
      <ReactQueryDevtools buttonPosition="bottom-left" />
    </>
  )
}
