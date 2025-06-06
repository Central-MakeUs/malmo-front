'use client'

import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import { CircleIcon } from 'lucide-react'
import { use } from 'react'
import * as React from 'react'
import { useFormContext } from 'react-hook-form'

import { cn } from '../lib/utils'
import { FormControl, FormControllerItem, FormItemContext, useFormField } from './form'
import { Label } from './label'

function RadioGroup({ className, onChange, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn('grid gap-3', className)}
      onChange={onChange}
      onValueChange={onChange as any}
      {...props}
    />
  )
}

function RadioGroupItem({ className, children, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  const id = props.value
  const formItem = use(FormItemContext)
  const isFormField = !!formItem.id

  const labelRender = (
    <Label className={cn('cursor-pointer', className)} htmlFor={id}>
      {children}
    </Label>
  )

  const itemRender = (
    <RadioGroupPrimitive.Item
      id={id}
      data-slot="radio-group-item"
      className={cn(
        'aspect-square size-4 shrink-0 cursor-pointer rounded-full border border-input text-primary shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:bg-input/30 dark:aria-invalid:ring-destructive/40'
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="relative flex items-center justify-center"
      >
        <CircleIcon className="absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 fill-primary" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )

  if (!isFormField)
    return (
      <div className="group flex flex-row items-center gap-2">
        <>
          {itemRender}
          {labelRender}
        </>
      </div>
    )

  return (
    <FormControllerItem className="group flex flex-row items-center gap-2">
      <FormControl>{itemRender}</FormControl>
      {labelRender}
    </FormControllerItem>
  )
}

export { RadioGroup, RadioGroupItem }
