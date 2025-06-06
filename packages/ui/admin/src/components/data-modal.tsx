'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@ui/common/components/dialog'
import { Skeleton } from '@ui/common/components/skeleton'
import * as React from 'react'
import { createContext, use } from 'react'
import { DescriptionItemProps, DescriptionsProps } from './descriptions'

export interface DataModalDescriptions<T extends Record<string, any>> extends Omit<DescriptionsProps, 'items'> {
  items: (Pick<DescriptionItemProps, 'span'> & {
    accessorKey: string
    header?: string
    render?: (value: any, record: T, index: number) => React.ReactNode
  })[]
}

interface DataModalProps<T extends Record<string, any>> extends React.ComponentProps<typeof Dialog> {
  loading?: boolean
  type: ModalType
  title?: string
  description?: string
  className?: string
  children: React.ReactNode
  footer?: React.ReactNode
}

export type ModalType = 'create' | 'update' | 'show' | null

type DataModalContextType = {
  type: ModalType
  record?: Record<string, any>
}

const DataModalContext = createContext<DataModalContextType>({
  type: 'show',
})

export function DataModal<T extends Record<string, any>>(props: DataModalProps<T>) {
  const { loading, type, title, description, footer, className, children, ...rest } = props

  function renderBody() {
    if (loading) {
      return (
        <div className="flex flex-col space-y-3">
          <Skeleton className="h-[200px] w-full rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-[50%]" />
          </div>
        </div>
      )
    }
    return <div className="flex max-h-[80vh] flex-col gap-3 space-x-2 overflow-auto">{children}</div>
  }

  return (
    <DataModalContext.Provider value={{ type }}>
      <Dialog {...rest}>
        <DialogContent className="top-[20%] translate-y-[-20%] sm:max-w-xl md:max-w-2xl lg:max-w-4xl">
          <DialogHeader>
            {title && <DialogTitle>{title}</DialogTitle>}
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          {renderBody()}
          {footer && <DialogFooter>{footer}</DialogFooter>}
        </DialogContent>
      </Dialog>
    </DataModalContext.Provider>
  )
}

export function DataModalCreate({ children }: { children: React.ReactNode }) {
  const { type } = use(DataModalContext)
  if (type !== 'create') return null
  return <>{children}</>
}

export function DataModalUpdate({ children }: { children: React.ReactNode }) {
  const { type } = use(DataModalContext)
  if (type !== 'update') return null
  return <>{children}</>
}

export function DataModalCreateOrUpdate({ children }: { children: React.ReactNode }) {
  const { type } = use(DataModalContext)
  if (type !== 'create' && type !== 'update') return null
  return <>{children}</>
}

export function DataModalShow({ children }: { children: React.ReactNode }) {
  const { type } = use(DataModalContext)
  if (type !== 'show') return null
  return <>{children}</>
}
