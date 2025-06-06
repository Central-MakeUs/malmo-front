'use client'

import * as TabsPrimitive from '@radix-ui/react-tabs'
import * as React from 'react'

import { cn } from '../lib/utils'

type TabStyle = 'underline' | 'bordered' | 'pill'

interface TabsProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root> {
  variant?: TabStyle
}

const TabsContext = React.createContext<{ variant?: TabStyle }>({})

function Tabs({ className, variant = 'underline', ...props }: TabsProps) {
  return (
    <TabsContext.Provider value={{ variant }}>
      <TabsPrimitive.Root data-slot="tabs" className={cn('flex flex-col gap-2', className)} {...props} />
    </TabsContext.Provider>
  )
}

function TabsList({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        'inline-flex h-9 w-fit items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground',
        className
      )}
      {...props}
    />
  )
}

interface TabsTriggerProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> {
  showNumber?: boolean
  number?: number
}

function TabsTrigger({ className, showNumber, number, children, ...props }: TabsTriggerProps) {
  const { variant } = React.useContext(TabsContext)

  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        'group inline-flex items-center justify-center px-10 py-2 text-sm font-medium whitespace-nowrap ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
        variant === 'underline' &&
          'text-grey-03 relative border-b-2 border-b-transparent data-[state=active]:border-b-2 data-[state=active]:border-b-black data-[state=active]:font-bold data-[state=active]:text-black',
        variant === 'bordered' &&
          'border-b-balck border-b border-black data-[state=active]:border data-[state=active]:border-black data-[state=active]:border-b-transparent data-[state=active]:bg-white data-[state=active]:text-foreground',
        variant === 'pill' &&
          'text-muted-foreground data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm',
        className
      )}
      {...props}
    >
      {children}
      {showNumber && number && (
        <span className="ml-2 inline-flex aspect-square items-center justify-center text-xs font-medium data-[state=active]:text-foreground">
          {number}
        </span>
      )}
    </TabsPrimitive.Trigger>
  )
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return <TabsPrimitive.Content data-slot="tabs-content" className={cn('flex-1 outline-none', className)} {...props} />
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
