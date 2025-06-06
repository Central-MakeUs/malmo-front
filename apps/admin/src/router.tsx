import { NotFound } from '@/shared/components/not-found'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRouter as createTanStackRouter, ErrorComponent } from '@tanstack/react-router'
import { AlertDialogProvider } from '@ui/common/components/global-alert-dialog'
import React from 'react'
import { routeTree } from './routeTree.gen'

export function createRouter() {
  const queryClient = new QueryClient()

  return createTanStackRouter({
    routeTree,
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
    scrollRestoration: true,
    defaultStructuralSharing: true,
    defaultNotFoundComponent: () => <NotFound />,
    defaultErrorComponent: ({ error }) => {
      return <ErrorComponent error={error} />
    },
    context: {
      auth: {} as any,
      queryClient,
    },
    Wrap: ({ children, ...rest }) => {
      return (
        <QueryClientProvider client={queryClient}>
          <AlertDialogProvider>{children}</AlertDialogProvider>
        </QueryClientProvider>
      )
    },
  })
}
