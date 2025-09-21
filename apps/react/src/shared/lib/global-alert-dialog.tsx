import { useBridge } from '@webview-bridge/react'
import * as React from 'react'
import { createContext, useState, useCallback, useEffect, useRef } from 'react'

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
  openAlertDialog: boolean
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
  const [openAlertDialog, setOpenAlertDialog] = useState(false)
  const [state, setState] = useState<AlertDialogOpenOptions>({ description: '' })
  const isModalOpenOnNative = useBridge(bridge.store, (store) => store.isModalOpen)
  const previousIsModalOpenRef = useRef(isModalOpenOnNative)

  const open = useCallback((options: AlertDialogOpenOptions) => {
    setOpenAlertDialog(true)
    setState({ ...options })
  }, [])

  const close = useCallback(() => {
    setOpenAlertDialog(false)
  }, [])

  useEffect(() => {
    const previousIsModalOpen = previousIsModalOpenRef.current

    if (!isModalOpenOnNative && previousIsModalOpen && openAlertDialog) {
      state.onCancel?.()
      setOpenAlertDialog(false)
    } else if (isModalOpenOnNative && !openAlertDialog) {
      setOpenAlertDialog(true)
    }

    previousIsModalOpenRef.current = isModalOpenOnNative
  }, [isModalOpenOnNative, openAlertDialog, state])

  useEffect(() => {
    void bridge.setModalOpen(openAlertDialog)
  }, [openAlertDialog])

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
  const { openAlertDialog, title, description, image, cancelText, confirmText, onConfirm, onCancel, close } =
    useAlertDialog()

  return (
    <AlertDialog open={openAlertDialog} onOpenChange={close}>
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
