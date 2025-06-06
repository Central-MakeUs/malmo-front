import { flexRender, Table } from '@tanstack/react-table'
import { TableHead, TableHeader, TableRow } from '@ui/common/components/table'
import React from 'react'
import { DataTableColumnHeader } from './data-table-column-header'

interface DataTableHeaderProps<TData> {
  table: Table<TData>
}

export function DataTableHeader<TData>({ table }: DataTableHeaderProps<TData>) {
  return (
    <TableHeader>
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id}>
          {headerGroup.headers.map((header) => {
            const title = flexRender(header.column.columnDef.header, header.getContext())
            return (
              <TableHead key={header.id} className={`w-${header.getSize()}`} colSpan={header.colSpan}>
                {header.isPlaceholder ? null : <DataTableColumnHeader column={header.column} title={title} />}
              </TableHead>
            )
          })}
        </TableRow>
      ))}
    </TableHeader>
  )
}
