'use client'

import { Table } from '@tanstack/react-table'

import { Button } from '@ui/common/components/button'
import { Input } from '@ui/common/components/input'
import { useDebounce } from '@ui/common/hooks/debounce.hook'
import { Search, X } from 'lucide-react'
import * as React from 'react'
import { ReactNode, useMemo, useState } from 'react'

import { DataTableFacetedFilter, DataTableFacetedFilterProps } from './data-table-faceted-filter'
import { DataTableViewOptions } from './data-table-view-options'

export interface DataTableToolbarProps<TData> {
  table: Table<TData>
  manualSearch?: boolean
  viewOptionsEnabled?: boolean
  viewOptionsTitle?: string
  viewOptionsMenuTitle?: string
  searchPlaceHolder?: string
  resetButtonTitle?: string
  topRightItems?: ReactNode[]
  onFilterChange?: (params: Record<string, any>) => void
  filter?: {
    query?: Record<string, any>
    searchKey?: string
    items: Omit<DataTableFacetedFilterProps<TData, any>, 'column' | 'value' | 'onFilterChange'>[]
  }
}

export function DataTableToolbar<TData>(props: DataTableToolbarProps<TData>) {
  const {
    table,
    topRightItems,
    viewOptionsEnabled = false,
    viewOptionsTitle,
    viewOptionsMenuTitle,
    searchPlaceHolder = '검색',
    resetButtonTitle = '초기화',
    manualSearch,
    filter,
    onFilterChange,
  } = props

  const [tableSearchValue, setTableSearchValue] = useState(
    filter?.searchKey ? (filter?.query?.[filter?.searchKey] ?? '') : ''
  )

  const isFiltered = useMemo(() => {
    if (manualSearch) {
      return (
        !!tableSearchValue ||
        filter?.items.some((item) => {
          return filter?.query?.[item.accessorKey] !== undefined
        })
      )
    }
    return table.getState().columnFilters.length > 0
  }, [props.manualSearch, tableSearchValue, props.filter?.query, props.table.getState().columnFilters])

  const handleSearchChange = useDebounce((value: string) => {
    if (filter?.searchKey) {
      onFilterChange?.({ [filter.searchKey]: value })
    }
  }, 300)

  function handleReset() {
    setTableSearchValue('')
    if (manualSearch) {
      const resetSearch = {}
      if (filter?.searchKey) {
        resetSearch[filter.searchKey] = undefined
      }
      filter?.items.forEach((item) => {
        resetSearch[item.accessorKey] = undefined
      })
      onFilterChange?.(resetSearch)
    } else {
      table.resetColumnFilters()
    }
  }

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {filter?.searchKey && (
          <div className="relative w-[150px] lg:w-[250px]">
            <Search className="absolute top-2.5 left-2 h-4 w-4 text-muted-foreground" />
            <Input
              className="h-8 pl-8"
              placeholder={searchPlaceHolder}
              value={tableSearchValue}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  if (manualSearch) {
                    if (filter?.searchKey && filter?.query?.[filter.searchKey] !== tableSearchValue) {
                      handleSearchChange(tableSearchValue)
                    }
                  } else {
                    table.getColumn(filter.searchKey!)?.setFilterValue(tableSearchValue)
                  }
                }
              }}
              onChange={(event) => {
                const newValue = event.target.value
                setTableSearchValue(newValue)
              }}
            />
          </div>
        )}
        {filter?.items?.map((item, i) => {
          const { title, ...rest } = item
          return (
            <DataTableFacetedFilter
              key={i}
              manualSearch={manualSearch}
              {...rest}
              title={title ?? item.accessorKey}
              value={filter?.query?.[item.accessorKey]}
              column={manualSearch ? undefined : table.getColumn(item.accessorKey)}
              onFilterChange={onFilterChange}
            />
          )
        })}
        {isFiltered && (
          <Button variant="ghost" onClick={handleReset} size="sm" className="px-2 lg:px-3">
            {resetButtonTitle}
            <X />
          </Button>
        )}

        <div className="ml-auto flex items-center gap-2">
          {topRightItems}
          {viewOptionsEnabled && (
            <DataTableViewOptions table={table} title={viewOptionsTitle} menuTitle={viewOptionsMenuTitle} />
          )}
        </div>
      </div>
    </div>
  )
}
