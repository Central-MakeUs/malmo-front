import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRouter as createTanStackRouter } from '@tanstack/react-router'

import { NotFound } from '@/shared/ui/not-found'
import { RouterError } from '@/shared/ui/router-error'

import { routeTree } from './routeTree.gen'

export function createRouter() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        throwOnError: true, // GET 요청은 Error Boundary로
        //refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: false,
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
    defaultErrorComponent: ({ error }) => (
      <div className="main-scrollable app-safe flex h-screen w-full flex-col overflow-hidden bg-white">
        <main className="relative mx-auto flex min-h-0 w-full max-w-[600px] flex-1 flex-col">
          <RouterError error={error} />
        </main>
      </div>
    ),
    context: {
      auth: {} as never,
      queryClient,
    },
    Wrap: ({ children }) => {
      return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    },
  })
}
