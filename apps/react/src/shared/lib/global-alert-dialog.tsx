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
  isOpen: boolean
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
  const [isOpen, setIsOpen] = useState(false)
  const [state, setState] = useState<AlertDialogOpenOptions>({ description: '' })

  const isNativeOpen = useBridge(bridge.store, (store) => store.isModalOpen)

  React.useEffect(() => {
    if (isNativeOpen !== null && isNativeOpen !== undefined) {
      setIsOpen(isNativeOpen)
    }
  }, [isNativeOpen])

  const open = (options: AlertDialogOpenOptions) => {
    setIsOpen(true)
    setState({ ...options })

    if (typeof bridge?.setModalOpen === 'function') {
      bridge.setModalOpen(true)
    }
  }

  const close = () => {
    setIsOpen(false)

    if (typeof bridge?.setModalOpen === 'function') {
      bridge.setModalOpen(false)
    }
  }

  const { cancelText, confirmText, ...rest } = state

  return (
    <AlertDialogContext.Provider
      value={{
        ...rest,
        isOpen,
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
  const { isOpen, title, description, image, cancelText, confirmText, onConfirm, onCancel, close } = useAlertDialog()

  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleConfirm = async () => {
    if (isSubmitting) return

    try {
      setIsSubmitting(true)
      await onConfirm?.()
    } finally {
      setIsSubmitting(false)
      close()
    }
  }

  const handleCancel = async () => {
    if (isSubmitting) return

    try {
      setIsSubmitting(true)
      await onCancel?.()
    } finally {
      setIsSubmitting(false)
      close()
    }
  }

  React.useEffect(() => {
    if (!isOpen) {
      setIsSubmitting(false)
    }
  }, [isOpen])

  return (
    <AlertDialog open={isOpen} onOpenChange={isSubmitting ? undefined : close}>
      <AlertDialogContent>
        <div className="mb-5 flex justify-center">{image}</div>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && <AlertDialogDescription>{description}</AlertDialogDescription>}
        </AlertDialogHeader>
        <AlertDialogFooter>
          {cancelText && (
            <AlertDialogCancel onClick={handleCancel} disabled={isSubmitting}>
              {cancelText}
            </AlertDialogCancel>
          )}
          <AlertDialogAction onClick={handleConfirm} disabled={isSubmitting}>
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
