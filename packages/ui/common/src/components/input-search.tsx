'use client'

import { Check, ChevronsUpDown, Loader2, X } from 'lucide-react'
import { ReactNode, useCallback, useEffect, useState } from 'react'
import { useDebounce } from '../hooks/debounce.hook'
import { cn } from '../lib/utils'
import { Badge } from './badge'
import { Button } from './button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './command'
import { Popover, PopoverContent, PopoverTrigger } from './popover'

export interface InputSearchProps<T extends Record<string, any>> {
  value?: any
  data?: T[]
  onChange?: (value: any) => void
  idKey?: string
  labelKey?: string
  dataKey?: string
  onValue?: (value: any) => Promise<any>
  onSearch?: (text?: string) => Promise<any>
  placeholder?: string
  searchPlaceholder?: string
  selectedPlaceholder?: (count: number) => string
  emptyMessage?: string
  errorMessage?: string
  multiple?: boolean
  searchable?: boolean
  itemRender?: (record: T) => ReactNode
  className?: string
  popoverClassName?: string
  badgeClassName?: string
  itemClassName?: string
}

export function InputSearch<T extends Record<string, any>>({
  value,
  onChange,
  idKey = 'id',
  labelKey = 'name',
  dataKey = 'data',
  onValue,
  placeholder = '선택하세요...',
  searchPlaceholder = '검색...',
  selectedPlaceholder = (count) => `${count}개 항목 선택됨`,
  emptyMessage = '결과가 없습니다.',
  errorMessage = '데이터를 불러오는 중 오류가 발생했습니다.',
  onSearch,
  itemRender,
  multiple = false,
  searchable = true,
  className,
  popoverClassName,
  badgeClassName,
  itemClassName,
  ...props
}: InputSearchProps<T>) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState<string>()
  const [selectedItems, setSelectedItems] = useState<T[]>([])
  const [data, setData] = useState(props.data || [])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (value) {
      const values = Array.isArray(value) ? value : [value]
      if (props.data) {
        const selectedItems = values
          .map((item) => props.data!.find((data) => data[idKey] === item))
          .filter((item) => !!item)
        setSelectedItems([...selectedItems])
      } else {
        Promise.all(
          values.map(async (value) => {
            let record = selectedItems.find((item) => item[idKey] === value)
            if (!record) record = await onValue?.(value)
            return record || value
          })
        )
          .then((records) => {
            setSelectedItems([...records])
          })
          .catch(() => {
            setSelectedItems([])
          })
      }
    }
  }, [value])

  useEffect(() => {
    handleSearchChange()
  }, [])

  const handleOnChange = (selectedItems: T[]) => {
    if (onChange) {
      if (multiple) {
        onChange(selectedItems.map((item) => item[idKey]))
      } else {
        onChange(selectedItems.length > 0 ? selectedItems[0]![idKey] : null)
      }
    }
  }

  const handleSelect = useCallback(
    (item: T) => {
      let newItems = [...selectedItems]
      if (multiple) {
        const selected = newItems.some((selectedItem) => selectedItem[idKey] === item[idKey])
        if (selected) {
          newItems = newItems.filter((p) => p[idKey] !== item[idKey])
        } else {
          newItems.push(item)
        }
      } else {
        newItems = [item]
        setOpen(false)
      }
      setSelectedItems([...newItems])
      handleOnChange(newItems)
    },
    [selectedItems, multiple, idKey]
  )

  const handleRemove = useCallback(
    (itemValue: T) => {
      const newItems = selectedItems.filter((item) => item[idKey] !== itemValue[idKey])
      setSelectedItems(newItems)
      handleOnChange(newItems)
    },
    [selectedItems, idKey]
  )

  const handleSearchChange = useDebounce(
    async (search?: string) => {
      setError(null)

      console.log(search)
      try {
        if (props.data) {
          if (search?.length) {
            const newData = props.data.filter((item) => item[labelKey].includes(search))
            setData([...newData])
          } else {
            setData([...props.data])
          }
        } else if (onSearch) {
          setLoading(true)
          const newData = await onSearch(search)
          if (dataKey) {
            setData([...newData[dataKey]])
          } else {
            setData([...newData])
          }
        }
      } catch (e) {
        setError(errorMessage)
        setData([])
      } finally {
        setLoading(false)
      }
    },
    props.data ? 0 : 200
  )

  return (
    <div className="flex flex-col gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn('w-full justify-between', className)}
            onClick={() => setOpen(!open)}
          >
            <span className="flex-grow truncate text-left">
              {multiple ? (
                <span className={selectedItems.length === 0 ? 'text-muted-foreground' : ''}>
                  {selectedItems.length > 0 ? selectedPlaceholder(selectedItems.length) : placeholder}
                </span>
              ) : (
                <span>
                  {selectedItems.length ? (
                    itemRender?.(selectedItems[0]!) || selectedItems[0]![labelKey]
                  ) : (
                    <span className="text-muted-foreground">{placeholder}</span>
                  )}
                </span>
              )}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        {multiple && selectedItems.length > 0 && (
          <div className="mb-1.5 flex flex-wrap gap-1.5">
            {selectedItems.map((item) => (
              <Badge
                key={item[idKey]}
                variant="secondary"
                className={cn('flex items-center gap-1 px-2 py-1', badgeClassName)}
              >
                {itemRender?.(item) || item[labelKey]}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="ml-1 h-4 w-4 p-0 hover:bg-transparent"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemove(item)
                  }}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">제거</span>
                </Button>
              </Badge>
            ))}
          </div>
        )}
        <PopoverContent
          className={cn('p-0', popoverClassName)}
          align="start"
          style={{ width: 'var(--radix-popover-trigger-width)' }}
        >
          <Command shouldFilter={false}>
            {searchable && (
              <CommandInput
                placeholder={searchPlaceholder}
                value={search}
                onValueChange={(value) => {
                  setSearch(value)
                  handleSearchChange(value)
                }}
              />
            )}
            <CommandList>
              {loading && (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              )}
              {error && <div className="py-6 text-center text-sm text-destructive">{error}</div>}
              {!loading && !error && data.length === 0 && <CommandEmpty>{emptyMessage}</CommandEmpty>}
              {!loading && !error && data.length > 0 && (
                <CommandGroup>
                  {data.map((item) => {
                    const optionValue = item[idKey]
                    const selected = selectedItems.some((items) => items[idKey] === optionValue)

                    return (
                      <CommandItem
                        key={String(optionValue)}
                        value={String(optionValue)}
                        onSelect={() => handleSelect(item)}
                        className={cn(selected && multiple ? 'bg-secondary/30' : '', itemClassName)}
                      >
                        <span
                          className={cn(
                            'mr-2 flex h-4 w-4 items-center justify-center',
                            selected ? 'opacity-100' : 'opacity-0'
                          )}
                        >
                          <Check className="h-4 w-4" />
                        </span>
                        <span>{itemRender?.(item) || item[labelKey]}</span>
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
