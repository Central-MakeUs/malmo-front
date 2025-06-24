import { RouterProvider } from '@tanstack/react-router'
import React from 'react'
import { createRouter } from './router'
import { AuthProvider, useAuth } from '@/shared/libs/auth'
import { ThemeProvider } from '@ui/common/contexts/theme.context'
import { AlertDialogProvider } from '@ui/common/components/global-alert-dialog'

import { linkBridge } from '@webview-bridge/web'
import { AppBridge, AppPostMessageSchema } from '@mobile/bridge'

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export const bridge = linkBridge<AppBridge, AppPostMessageSchema>({
  throwOnError: true,
  initialBridge: {
    count: 10,
    data: {
      text: 'Test',
    },
    increase: async () => {
      alert('not support increase')
    },
    openInAppBrowser: async (url) => {
      alert('not support openInAppBrowser: ' + url)
    },
    setDataText: async (text) => {
      alert('not support setDataText: ' + text)
    },
    getMessage: async () => {
      return "I'm from native"
    },
  },
  onReady: () => {
    // eslint-disable-next-line no-console
    console.log('bridge is ready')
  },
  onFallback: (methodName, args) => {
    // eslint-disable-next-line no-console
    console.log('fallback', methodName, args)
  },
})

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
