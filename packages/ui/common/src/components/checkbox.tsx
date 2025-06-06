'use client'

import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { CheckIcon } from 'lucide-react'
import * as React from 'react'
import { cn } from '../lib/utils'

function Checkbox({
  children,
  className,
  onChange,
  ...props
}: React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>) {
  const id = React.useId()

  function handleChange(checked: boolean) {
    onChange?.(checked as any)
  }

  return (
    <div className={cn('flex flex-row items-center gap-[8px]', className)}>
      <CheckboxPrimitive.Root
        id={id}
        data-slot="checkbox"
        onCheckedChange={handleChange}
        className={cn(
          'peer size-4 shrink-0 rounded-[4px] border border-input text-body-01 shadow-xs transition-shadow outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:aria-invalid:ring-destructive/40',
          className
        )}
        {...props}
      >
        <CheckboxPrimitive.Indicator
          data-slot="checkbox-indicator"
          className="items-center justify-center bg-amber-50 text-current transition-none"
        >
          <CheckIcon className="size-3.5" />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      {children && (
        <label
          htmlFor={id}
          className="cursor-pointer text-sm leading-none font-medium select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {children}
        </label>
      )}
    </div>
  )
}

export { Checkbox }
