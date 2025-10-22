import { use, useCallback, useMemo } from 'react'

import { useIsFrozenRoute } from '@/shared/navigation/transition/route-phase-context'

import { AlertDialogContext } from '../lib/global-alert-dialog'

export const useAlertDialog = () => {
  const context = use(AlertDialogContext)
  if (!context) throw new Error('useAlertDialog must be used within an AlertDialogProvider')
  const isFrozen = useIsFrozenRoute()

  const safeOpen = useCallback(
    (options: Parameters<typeof context.open>[0]) => {
      if (isFrozen) return
      context.open(options)
    },
    [context, isFrozen]
  )

  return useMemo(
    () => ({
      ...context,
      open: safeOpen,
    }),
    [context, safeOpen]
  )
}
