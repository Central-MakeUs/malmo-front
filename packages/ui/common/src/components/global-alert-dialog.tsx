import * as React from 'react'
import { createContext, useState } from 'react'
import { useAlertDialog } from '../hooks/alert-dialog.hook'
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
} from './alert-dialog'

type AlertDialogOpenOptions = {
  title?: string
  description: string
  cancelText?: string
  confirmText?: string
  destructive?: boolean
  onConfirm?: () => void
}

interface AlertDialogContextType {
  openAlertDialog: boolean
  title?: string
  description: string
  cancelText?: string
  confirmText: string
  destructive?: boolean
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
    setState({ ...options })
    setOpenAlertDialog(true)
  }

  const close = () => {
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
  const { openAlertDialog, title, description, cancelText, destructive, confirmText, onConfirm, close } =
    useAlertDialog()

  return (
    <AlertDialog open={openAlertDialog} onOpenChange={close}>
      <AlertDialogContent>
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
