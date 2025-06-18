import { RouterProvider } from '@tanstack/react-router'
import React from 'react'
import { createRouter } from './router'
import { AuthProvider, useAuth } from '@/shared/libs/auth'
import { ThemeProvider } from '@ui/common/contexts/theme.context'
import { AlertDialogProvider } from '@ui/common/components/global-alert-dialog'

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
      <AuthProvider>
        <AlertDialogProvider>
          <InnerApp />
        </AlertDialogProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
