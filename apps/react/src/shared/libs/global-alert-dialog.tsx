import * as React from 'react'
import { createContext, useState } from 'react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogDestructive,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/alert-dialog'
import { useAlertDialog } from '../hook/alert-dialog.hook'
import bridge from '../bridge'

type AlertDialogOpenOptions = {
  title?: string
  description: string
  cancelText?: string
  confirmText?: string
  destructive?: boolean
  onConfirm?: () => void
  overlayLevel?: 1 | 2
}

interface AlertDialogContextType {
  openAlertDialog: boolean
  title?: string
  description: string
  cancelText?: string
  confirmText: string
  destructive?: boolean
  overlayLevel?: 1 | 2
  onConfirm?: () => void | Promise<void>
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
    setState({ ...options })
    setOpenAlertDialog(true)
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
        overlayLevel: 1,
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
  const { openAlertDialog, title, description, cancelText, destructive, confirmText, onConfirm, close, overlayLevel } =
    useAlertDialog()

  return (
    <AlertDialog open={openAlertDialog} onOpenChange={close}>
      <AlertDialogContent overlayClassName={overlayLevel === 1 ? 'bg-black/40' : 'bg-black/80'}>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {cancelText && <AlertDialogCancel onClick={close}>{cancelText}</AlertDialogCancel>}
          {destructive && (
            <AlertDialogDestructive
              onClick={() => {
                onConfirm?.()
                close()
              }}
            >
              {confirmText}
            </AlertDialogDestructive>
          )}
          {!destructive && (
            <AlertDialogAction
              onClick={() => {
                onConfirm?.()
                close()
              }}
            >
              {confirmText}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
