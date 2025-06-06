import { Column } from '@tanstack/react-table'
import { Button } from '@ui/common/components/button'
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react'
import React from 'react'

import { cn } from '../lib/utils'

interface DataTableColumnHeaderProps<TData, TValue> extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  column: Column<TData, TValue>
  title: string | React.ReactNode
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort() || !column.columnDef.enableSorting) {
    return <div className={cn(className)}>{title}</div>
  }

  function handleSort() {
    const sorted = column.getIsSorted()
    if (!sorted) {
      column.toggleSorting(false)
    } else {
      if (sorted === 'asc') {
        column.toggleSorting(true)
      } else {
        column.toggleSorting(undefined)
      }
    }
  }

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <Button variant="ghost" size="sm" className="-ml-3 h-8 data-[state=open]:bg-accent" onClick={handleSort}>
        <span>{title}</span>
        {column.getIsSorted() === 'desc' ? (
          <ArrowDown />
        ) : column.getIsSorted() === 'asc' ? (
          <ArrowUp />
        ) : (
          <ChevronsUpDown />
        )}
      </Button>
    </div>
  )
}
