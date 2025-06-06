'use client'

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  RowData,
  RowSelectionState,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table'
import { Checkbox } from '@ui/common/components/checkbox'
import { Skeleton } from '@ui/common/components/skeleton'
import { Table, TableBody, TableCell, TableRow } from '@ui/common/components/table'
import { Inbox } from 'lucide-react'
import * as React from 'react'
import { useMemo } from 'react'
import { DataTableHeader } from './data-table-header'
import { DataTablePagination } from './data-table-pagination'
import { DataTableToolbar, DataTableToolbarProps } from './data-table-toolbar'

interface DataTableProps<TData extends RowData> {
  loading?: string
  columns: ColumnDef<TData>[]
  data?: TData[]
  total?: number
  noDataText?: string
  manualSearch?: boolean
  selectedEnabled?: boolean
  columnFilters?: ColumnFiltersState
  pagination?: {
    pageIndex: number
    pageSize: number
  }
  sorting?: SortingState
  toolbar?: Omit<DataTableToolbarProps<TData>, 'table'>
  onTableChange?: (search: Record<string, any>) => void
  onRowSelectionChange?: (indexes: number[]) => void
  onRow?: (record: TData) => void
}

export function DataTable<TData extends RowData>(props: DataTableProps<TData>) {
  const {
    loading,
    columns,
    data = [],
    total,
    noDataText = '데이터 없음',
    selectedEnabled = false,
    manualSearch = true,
    pagination = {
      pageIndex: 0,
      pageSize: 10,
    },
    sorting = [],
    onTableChange,
    onRowSelectionChange,
    onRow,
    toolbar,
  } = props

  const [tableSorting, setTableSorting] = React.useState<SortingState>(sorting)
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})
  const [tablePagination, setTablePagination] = React.useState(pagination)

  const tableColumns = useMemo(() => {
    if (selectedEnabled) {
      return [
        {
          id: 'select',
          header: ({ table }) => (
            <Checkbox
              checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
              onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
              aria-label="Select all"
              onClick={(e) => e.stopPropagation()}
            />
          ),
          cell: ({ row }) => (
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label="Select row"
              onClick={(e) => e.stopPropagation()}
            />
          ),
          enableSorting: false,
          enableHiding: false,
        },
        ...columns,
      ]
    }
    return columns
  }, [columns])

  function handleParamsChanged(params: Record<string, any>) {
    onTableChange?.(params)
  }

  function handleRowSelectionChange(rowSelection: RowSelectionState) {
    const selectedRows = Object.keys(rowSelection)
      .filter((key) => rowSelection[key])
      .map(Number)
    onRowSelectionChange?.(selectedRows)
  }

  const table = useReactTable({
    data,
    rowCount: total,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: (updaterOrValue) => {
      const state = typeof updaterOrValue === 'function' ? updaterOrValue(rowSelection) : updaterOrValue
      setRowSelection(updaterOrValue)
      handleRowSelectionChange(state)
    },
    onColumnFiltersChange: (updaterOrValue) => {
      const state = typeof updaterOrValue === 'function' ? updaterOrValue(columnFilters) : updaterOrValue
      setColumnFilters(state)

      const params = toolbar?.filter?.items?.reduce((acc, { accessorKey }) => {
        acc[accessorKey] = state.find(({ id }) => id === id)?.value
        return acc
      }, {})
      handleParamsChanged(params || {})
    },
    onSortingChange: (updaterOrValue) => {
      const state = typeof updaterOrValue === 'function' ? updaterOrValue(tableSorting) : updaterOrValue
      setTableSorting(state)
      const [newSort] = state
      if (newSort) {
        handleParamsChanged({
          sort: newSort.id,
          order: newSort.desc ? 'DESC' : 'ASC',
        })
      } else {
        handleParamsChanged({
          sort: undefined,
          order: undefined,
        })
      }
    },
    onPaginationChange: (updaterOrValue) => {
      const state = typeof updaterOrValue === 'function' ? updaterOrValue(tablePagination) : updaterOrValue
      setTablePagination(state)
      handleParamsChanged({
        page: state.pageIndex + 1,
        pageSize: state.pageSize,
      })
    },
    enableRowSelection: true,
    manualFiltering: manualSearch,
    manualPagination: manualSearch,
    manualSorting: manualSearch,
    state: {
      sorting: tableSorting,
      columnFilters,
      columnVisibility,
      pagination: tablePagination,
      rowSelection,
    },
  })

  function renderBody() {
    if (loading) {
      return (
        <TableRow>
          <TableCell colSpan={tableColumns.length} className="h-24 text-center">
            <div className="flex flex-col justify-center gap-4 py-12 pl-8 md:py-8">
              <div className="flex space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[300px]" />
                  <Skeleton className="h-4 w-[250px]" />
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[300px]" />
                  <Skeleton className="h-4 w-[250px]" />
                </div>
              </div>
            </div>
          </TableCell>
        </TableRow>
      )
    }
    return table.getRowModel().rows?.length ? (
      table.getRowModel().rows.map((row) => (
        <TableRow
          key={row.id}
          data-state={row.getIsSelected() && 'selected'}
          onClick={() => {
            onRow?.(row.original)
          }}
        >
          {row.getVisibleCells().map((cell) => (
            <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
          ))}
        </TableRow>
      ))
    ) : (
      <TableRow>
        <TableCell colSpan={tableColumns.length} className="h-24 text-center">
          <div className="flex flex-col items-center justify-center gap-4 py-12 md:py-16">
            <Inbox className="h-16 w-16 text-muted" />
            <div className="space-y-2 text-center">
              <p className="text-muted-foreground">{noDataText}</p>
            </div>
          </div>
        </TableCell>
      </TableRow>
    )
  }

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 py-4">
        <DataTableToolbar table={table} {...toolbar} manualSearch={manualSearch} onFilterChange={handleParamsChanged} />
      </div>
      <div className="rounded-md border">
        <Table>
          <DataTableHeader table={table} />
          <TableBody>{renderBody()}</TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} className="py-4" />
    </div>
  )
}
