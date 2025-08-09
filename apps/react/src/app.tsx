import { RouterProvider } from '@tanstack/react-router'
import { createRouter } from './router'
import { AuthProvider, useAuth } from '@/features/auth'
import { ThemeProvider } from '@/shared/contexts/theme.context'
import { AlertDialogProvider } from './shared/libs/global-alert-dialog'
import { ToastProvider } from '@/shared/components/toast'

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
