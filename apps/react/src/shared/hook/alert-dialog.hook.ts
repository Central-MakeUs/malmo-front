import { use } from 'react'
import { AlertDialogContext } from '../libs/global-alert-dialog'

export const useAlertDialog = () => {
  const context = use(AlertDialogContext)
  if (!context) throw new Error('useAlertDialog must be used within an AlertDialogProvider')
  return context
}
