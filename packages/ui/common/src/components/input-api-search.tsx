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
  initialOptions?: T[]
  value?: any
  onChange?: (value: any) => void
  idKey?: string
  labelKey?: string
  dataKey?: string
  onValue?: (value: any) => Promise<any>
  api?: (params: any) => Promise<any>
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
  required?: boolean
  searchLimit?: number
  pageStartIndex?: number
  pageParamName?: string
  limitParamName?: string
}

export function InputApiSearch<T extends Record<string, any>>(props: InputSearchProps<T>) {
  const {
    initialOptions,
    value,
    onChange,
    idKey = 'id',
    labelKey = 'name',
    dataKey = 'data',
    onValue,
    api,
    placeholder = '선택하세요...',
    searchPlaceholder = '검색...',
    selectedPlaceholder = (count) => `${count}개 항목 선택됨`,
    emptyMessage = '결과가 없습니다.',
    errorMessage = '데이터를 불러오는 중 오류가 발생했습니다.',
    itemRender,
    multiple = false,
    searchable = true,
    className,
    popoverClassName,
    badgeClassName,
    itemClassName,
    required = false,
    searchLimit = 10,
    pageStartIndex = 1,
  } = props

  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState<string>()
  const [selectedItems, setSelectedItems] = useState<T[]>(() => {
    if (!value || !initialOptions) return []
    const values = Array.isArray(value) ? value : [value]
    return initialOptions.filter((item) => values.includes(item[idKey]))
  })
  const [data, setData] = useState<T[]>(initialOptions || [])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(pageStartIndex)
  const [hasMore, setHasMore] = useState(true)
  const [isFetchingMore, setIsFetchingMore] = useState(false)

  useEffect(() => {
    if (value) {
      const values = Array.isArray(value) ? value : [value]
      if (onValue) {
        Promise.all(
          values.map(async (val) => {
            let record = selectedItems.find((item) => item[idKey] === val)
            if (!record && val) record = await onValue(val)
            return record
          })
        )
          .then((records) => {
            setSelectedItems([...(records.filter(Boolean) as T[])])
          })
          .catch(() => {
            setSelectedItems([])
          })
      }
    } else {
      setSelectedItems([])
    }
  }, [value, idKey, onValue])

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
    [selectedItems, multiple, idKey, handleOnChange]
  )

  const handleRemove = useCallback(
    (itemValue: T) => {
      const newItems = selectedItems.filter((item) => item[idKey] !== itemValue[idKey])
      setSelectedItems(newItems)
      handleOnChange(newItems)
    },
    [selectedItems, idKey, handleOnChange]
  )

  const fetchData = useCallback(
    async (currentSearch: string | undefined, currentPage: number, append: boolean) => {
      if (!api) return

      const stateSetter = append ? setIsFetchingMore : setLoading
      stateSetter(true)
      setError(null)

      try {
        const response = await api({
          search: currentSearch,
          page: currentPage,
          pageSize: searchLimit,
        })
        const resultData = dataKey ? response[dataKey] : response

        setData((prevData) => {
          const combinedData = append ? [...prevData, ...resultData] : [...(initialOptions || []), ...resultData]
          const uniqueData = Array.from(new Map(combinedData.map((item) => [item[idKey], item])).values())

          return uniqueData
        })

        setHasMore(resultData.length === searchLimit)
        setPage(currentPage)
      } catch (e) {
        setError(errorMessage)
        setData(initialOptions || [])
      } finally {
        stateSetter(false)
      }
    },
    [api, dataKey, searchLimit, initialOptions, errorMessage]
  )

  const handleSearchChange = useDebounce((search?: string) => {
    fetchData(search, pageStartIndex, false)
  }, 300)

  useEffect(() => {
    if (open && data.length === (initialOptions?.length || 0)) handleSearchChange(undefined)
  }, [open, initialOptions])

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (loading || isFetchingMore || !hasMore) return
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
    if (scrollHeight - scrollTop - clientHeight < 50) {
      fetchData(search, page + 1, true)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn('w-full justify-between', className)}
          >
            <span className="flex-grow truncate text-left">
              {multiple ? (
                <span className={selectedItems.length === 0 ? 'text-muted-foreground' : ''}>
                  {selectedItems.length > 0 ? selectedPlaceholder(selectedItems.length) : placeholder}
                </span>
              ) : (
                <span>
                  {selectedItems.length > 0 ? (
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
            <CommandList onScroll={handleScroll}>
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
              {isFetchingMore && (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
