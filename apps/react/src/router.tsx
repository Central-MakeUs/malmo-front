import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import React from 'react'

import { NotFound } from '@/shared/ui/not-found'
import { RouterError } from '@/shared/ui/router-error'

import { routeTree } from './routeTree.gen'

export function createRouter() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        throwOnError: true, // GET 요청은 Error Boundary로
      },
    },
  })

  return createTanStackRouter({
    routeTree,
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
    scrollRestoration: true,
    scrollToTopSelectors: ['.main-scrollable'],
    defaultStructuralSharing: true,
    defaultNotFoundComponent: () => <NotFound />,
    defaultErrorComponent: ({ error }) => <RouterError error={error} />,
    context: {
      auth: {} as any,
      queryClient,
    },
    Wrap: ({ children }) => {
      return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    },
  })
}
