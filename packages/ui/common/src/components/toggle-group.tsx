'use client'

import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group'
import { type VariantProps } from 'class-variance-authority'
import * as React from 'react'
import { ReactNode, useRef } from 'react'

import { cn } from '../lib/utils'
import { toggleVariants } from './toggle'

const ToggleGroupContext = React.createContext<VariantProps<typeof toggleVariants>>({
  size: 'default',
  variant: 'default',
})

function ToggleGroup({
  className,
  variant,
  size,
  value,
  children,
  onChange,
  options,
  itemClassName,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Root> &
  VariantProps<typeof toggleVariants> & {
    itemClassName?: string
    options?: { value: any; label?: string | ReactNode; disabled?: boolean }[]
  }) {
  const originalValuesRef = useRef<Map<string, any>>(new Map())

  if (!options) {
    return (
      <ToggleGroupPrimitive.Root
        data-slot="toggle-group"
        data-variant={variant}
        data-size={size}
        className={cn(
          'group/toggle-group flex w-fit items-center rounded-md data-[variant=outline]:shadow-xs',
          className
        )}
        {...props}
      >
        <ToggleGroupContext.Provider value={{ variant, size }}>{children}</ToggleGroupContext.Provider>
      </ToggleGroupPrimitive.Root>
    )
  }

  React.useEffect(() => {
    if (options) {
      options.forEach((option) => {
        originalValuesRef.current.set(String(option.value), option.value)
      })
    }
  }, [options])

  const handleValueChange = (newValue: string | string[]) => {
    if (Array.isArray(newValue)) {
      // 배열인 경우, 각 값을 원본으로 변환
      const originalValues = newValue.map((val) =>
        originalValuesRef.current.has(val) ? originalValuesRef.current.get(val) : val
      )
      onChange?.(originalValues as any)
    } else {
      // 단일 값인 경우, 원본으로 변환
      const originalValue = originalValuesRef.current.has(newValue) ? originalValuesRef.current.get(newValue) : newValue
      onChange?.(originalValue as any)
    }
  }

  return (
    <ToggleGroupPrimitive.Root
      data-slot="toggle-group"
      data-variant={variant}
      data-size={size}
      value={(Array.isArray(value) ? value.map((v) => v.toString()) : value?.toString()) as any}
      onValueChange={handleValueChange}
      className={cn(
        'group/toggle-group flex w-fit items-center rounded-md data-[variant=outline]:shadow-xs',
        className
      )}
      {...props}
    >
      <ToggleGroupContext.Provider value={{ variant, size }}>
        {options?.map((option, i) => {
          // 값을 렌더링 시 Map에 저장
          const stringValue = String(option.value)
          originalValuesRef.current.set(stringValue, option.value)

          return (
            <ToggleGroupItem className={itemClassName} key={i} disabled={option.disabled} value={stringValue}>
              {option.label ?? option.value}
            </ToggleGroupItem>
          )
        })}
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  )
}

function ToggleGroupItem({
  className,
  children,
  variant,
  size,
  value,
  onToggle,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Item> & VariantProps<typeof toggleVariants>) {
  const context = React.useContext(ToggleGroupContext)
  return (
    <ToggleGroupPrimitive.Item
      data-slot="toggle-group-item"
      data-variant={context.variant || variant}
      data-size={context.size || size}
      data-value={value}
      value={value.toString()}
      className={cn(
        toggleVariants({
          variant: context.variant || variant,
          size: context.size || size,
        }),
        'min-w-0 flex-1 shrink-0 rounded-none shadow-none first:rounded-l-md last:rounded-r-md focus:z-10 focus-visible:z-10 data-[variant=outline]:border-l-0 data-[variant=outline]:first:border-l',
        className
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  )
}

export { ToggleGroup, ToggleGroupItem }
