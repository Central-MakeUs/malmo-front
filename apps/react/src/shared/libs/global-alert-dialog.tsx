import * as React from 'react'
import { createContext, useState } from 'react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/alert-dialog'
import { useAlertDialog } from '../hook/alert-dialog.hook'
import bridge from '../bridge'

type AlertDialogOpenOptions = {
  title?: string | React.ReactNode
  description: string | React.ReactNode
  cancelText?: string
  confirmText?: string
  onConfirm?: () => void
  onCancel?: () => void
  overlayLevel?: 1 | 2
}

interface AlertDialogContextType {
  openAlertDialog: boolean
  title?: string | React.ReactNode
  description: string | React.ReactNode
  cancelText?: string
  confirmText: string
  onConfirm?: () => void | Promise<void>
  onCancel?: () => void | Promise<void>
  open: (options: AlertDialogOpenOptions) => void
  close: () => void
}

export const AlertDialogContext = createContext<AlertDialogContextType | null>(null)

export function AlertDialogProvider({
  defaultConfirmText = '확인',
  children,
}: {
  defaultConfirmText?: string
  children: React.ReactNode
}) {
  const [openAlertDialog, setOpenAlertDialog] = useState(false)
  const [state, setState] = useState<AlertDialogOpenOptions>({ description: '' })

  const open = (options: AlertDialogOpenOptions) => {
    bridge.toggleOverlay?.(options.overlayLevel ?? 1)
    setOpenAlertDialog(true)
    setState({ ...options })
  }

  const close = () => {
    bridge.toggleOverlay?.(0)
    setOpenAlertDialog(false)
  }

  const { cancelText, confirmText, ...rest } = state

  return (
    <AlertDialogContext.Provider
      value={{
        ...rest,
        cancelText,
        confirmText: confirmText ?? defaultConfirmText,
        openAlertDialog,
        open,
        close,
      }}
    >
      {children}
      <GlobalAlertDialog />
    </AlertDialogContext.Provider>
  )
}

export function GlobalAlertDialog() {
  const { openAlertDialog, title, description, cancelText, confirmText, onConfirm, onCancel, close } = useAlertDialog()

  return (
    <AlertDialog open={openAlertDialog} onOpenChange={close}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {cancelText && <AlertDialogCancel onClick={() => onCancel?.()}>{cancelText}</AlertDialogCancel>}
          <AlertDialogAction onClick={() => onConfirm?.()}>{confirmText}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
