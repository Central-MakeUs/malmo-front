import { RouterProvider } from '@tanstack/react-router'

import { AuthProvider, useAuth } from '@/features/auth'
import { ThemeProvider } from '@/shared/contexts/theme.context'
import { ToastProvider } from '@/shared/ui/toast'

import { createRouter } from './router'
import { AlertDialogProvider } from './shared/lib/global-alert-dialog'

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const router = createRouter()

function InnerApp() {
  const auth = useAuth()
  return <RouterProvider router={router} context={{ auth }} />
}

export function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <AlertDialogProvider>
            <InnerApp />
          </AlertDialogProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  )
}
