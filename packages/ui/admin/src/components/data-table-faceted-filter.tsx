import { Column } from '@tanstack/react-table'
import { Badge } from '@ui/common/components/badge'
import { Button } from '@ui/common/components/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@ui/common/components/command'
import { Popover, PopoverContent, PopoverTrigger } from '@ui/common/components/popover'
import { Separator } from '@ui/common/components/separator'
import { Check, ListFilter, ListFilterPlus } from 'lucide-react'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { cn } from '../lib/utils'

export interface DataTableFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>
  multiple?: boolean
  title?: string
  manualSearch?: boolean
  accessorKey: string
  value?: any
  options: {
    label: string
    value: any
    icon?: React.ComponentType<{ className?: string }>
  }[]
  onFilterChange?: (params: Record<string, any>) => void
  clearFilterText?: string
  emptyFilterText?: string
}

export function DataTableFacetedFilter<TData, TValue>(props: DataTableFacetedFilterProps<TData, TValue>) {
  const {
    manualSearch,
    column,
    title,
    multiple,
    options,
    accessorKey,
    value,
    emptyFilterText = '',
    clearFilterText = '필터 초기화',
    onFilterChange,
  } = props

  const facets = column?.getFacetedUniqueValues()
  const [selectedValues, setSelectedValues] = useState(new Set(column?.getFilterValue() as string[]))

  useEffect(() => {
    if (Array.isArray(value)) {
      setSelectedValues(new Set(value))
    } else {
      setSelectedValues(value !== null && value !== undefined ? new Set([value]) : new Set())
    }
  }, [props.value])

  const addItem = (item: string) => {
    setSelectedValues((prevItems) => {
      const newSet = new Set(prevItems)
      newSet.add(item)
      handleChange(newSet)
      return newSet
    })
  }

  const deleteItem = (item: string) => {
    setSelectedValues((prevItems) => {
      const newSet = new Set(prevItems)
      newSet.delete(item)
      handleChange(newSet)
      return newSet
    })
  }

  function handleChange(items: Set<string>) {
    if (manualSearch) {
      if (multiple) {
        onFilterChange?.({ [accessorKey]: Array.from(items) })
      } else {
        onFilterChange?.({ [accessorKey]: items.size ? Array.from(items)[0] : undefined })
      }
    } else {
      const filterValues = Array.from(selectedValues)
      column?.setFilterValue(filterValues.length ? filterValues : undefined)
    }
  }

  function handleReset() {
    setSelectedValues(new Set())
    if (manualSearch) {
      onFilterChange?.({ [accessorKey]: undefined })
    } else {
      column?.setFilterValue(undefined)
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="border-dashed">
          {multiple ? <ListFilterPlus /> : <ListFilter />}
          {title}
          {selectedValues?.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge variant="secondary" className="rounded-sm px-1 font-normal lg:hidden">
                {selectedValues.size}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValues.size > 2 ? (
                  <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                    {selectedValues.size} selected
                  </Badge>
                ) : (
                  options
                    .filter((option) => selectedValues.has(option.value))
                    .map((option) => (
                      <Badge variant="secondary" key={option.value} className="rounded-sm px-1 font-normal">
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>{emptyFilterText}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedValues.has(option.value)
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      if (multiple) {
                        if (isSelected) {
                          deleteItem(option.value)
                        } else {
                          addItem(option.value)
                        }
                      } else {
                        setSelectedValues(new Set([option.value]))
                        handleChange(new Set([option.value]))
                      }
                      const filterValues = Array.from(selectedValues)
                      column?.setFilterValue(filterValues.length ? filterValues : undefined)
                    }}
                  >
                    {multiple ? (
                      <div
                        className={cn(
                          'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                          isSelected ? 'bg-primary text-primary-foreground' : 'opacity-50 [&_svg]:invisible'
                        )}
                      >
                        <Check className="text-primary-foreground" />
                      </div>
                    ) : (
                      <div
                        className={cn(
                          'mr-2 flex h-4 w-4 items-center justify-center',
                          isSelected ? 'text-foreground' : 'opacity-50 [&_svg]:invisible'
                        )}
                      >
                        <Check className="text-foreground" />
                      </div>
                    )}

                    {option.icon && <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />}
                    <span>{option.label}</span>
                    {facets?.get(option.value) && (
                      <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                        {facets.get(option.value)}
                      </span>
                    )}
                  </CommandItem>
                )
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem onSelect={handleReset} className="justify-center text-center">
                    {clearFilterText}
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
