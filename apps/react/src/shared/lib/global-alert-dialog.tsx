import { useBridge } from '@webview-bridge/react'
import * as React from 'react'
import { createContext, useState } from 'react'

import bridge from '@/shared/bridge'

import { useAlertDialog } from '../hooks/use-alert-dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog'

type AlertDialogOpenOptions = {
  title?: string | React.ReactNode
  image?: React.ReactNode
  description?: string | React.ReactNode
  cancelText?: string
  confirmText?: string
  onConfirm?: () => void
  onCancel?: () => void
  overlayLevel?: 1 | 2
}

interface AlertDialogContextType {
  title?: string | React.ReactNode
  description?: string | React.ReactNode
  image?: React.ReactNode
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
  const [state, setState] = useState<AlertDialogOpenOptions>({ description: '' })

  const open = (options: AlertDialogOpenOptions) => {
    bridge.setModalOpen(true)
    setState({ ...options })
  }

  const close = () => {
    bridge.setModalOpen(false)
  }

  const { cancelText, confirmText, ...rest } = state

  return (
    <AlertDialogContext.Provider
      value={{
        ...rest,
        cancelText,
        confirmText: confirmText ?? defaultConfirmText,
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
  const { title, description, image, cancelText, confirmText, onConfirm, onCancel, close } = useAlertDialog()
  const isOpen = useBridge(bridge.store, (store) => store.isModalOpen)

  return (
    <AlertDialog open={isOpen} onOpenChange={close}>
      <AlertDialogContent>
        <div className="mb-5 flex justify-center">{image}</div>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && <AlertDialogDescription>{description}</AlertDialogDescription>}
        </AlertDialogHeader>
        <AlertDialogFooter>
          {cancelText && <AlertDialogCancel onClick={() => onCancel?.()}>{cancelText}</AlertDialogCancel>}
          <AlertDialogAction onClick={() => onConfirm?.()}>{confirmText}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
