'use client'

import * as SheetPrimitive from '@radix-ui/react-dialog'
import { motion, AnimatePresence } from 'framer-motion'
import { XIcon } from 'lucide-react'
import * as React from 'react'

import { cn } from '@/shared/lib/cn'

const SheetContext = React.createContext<{ open: boolean }>({ open: false })

function Sheet({ open, onOpenChange, ...props }: React.ComponentProps<typeof SheetPrimitive.Root>) {
  return (
    <SheetContext.Provider value={{ open: open || false }}>
      <SheetPrimitive.Root data-slot="sheet" open={open} onOpenChange={onOpenChange} {...props} />
    </SheetContext.Provider>
  )
}

function SheetTrigger({ ...props }: React.ComponentProps<typeof SheetPrimitive.Trigger>) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />
}

function SheetClose({ ...props }: React.ComponentProps<typeof SheetPrimitive.Close>) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />
}

function SheetPortal({ ...props }: React.ComponentProps<typeof SheetPrimitive.Portal>) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />
}

function SheetOverlay({ className, ...props }: React.ComponentProps<typeof SheetPrimitive.Overlay>) {
  return (
    <SheetPrimitive.Overlay data-slot="sheet-overlay" asChild {...props}>
      <motion.div
        className={cn('fixed inset-0 z-50 bg-black/40', className)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      />
    </SheetPrimitive.Overlay>
  )
}

function SheetContent({
  className,
  children,
  side = 'right',
  onOpenAutoFocus,
  onCloseAutoFocus,
  style,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & {
  side?: 'top' | 'right' | 'bottom' | 'left'
}) {
  const { open } = React.useContext(SheetContext)

  const safePadForBottom =
    side === 'bottom'
      ? {
          paddingBottom: 'calc(var(--safe-bottom))',
          paddingLeft: 'var(--safe-left)',
          paddingRight: 'var(--safe-right)',
        }
      : undefined

  // 애니메이션 설정
  const getMotionProps = () => {
    switch (side) {
      case 'bottom':
        return {
          initial: { y: '100%' },
          animate: { y: 0 },
          exit: { y: '100%' },
        }
      case 'top':
        return {
          initial: { y: '-100%' },
          animate: { y: 0 },
          exit: { y: '-100%' },
        }
      case 'left':
        return {
          initial: { x: '-100%' },
          animate: { x: 0 },
          exit: { x: '-100%' },
        }
      case 'right':
        return {
          initial: { x: '100%' },
          animate: { x: 0 },
          exit: { x: '100%' },
        }
      default:
        return {
          initial: { y: '100%' },
          animate: { y: 0 },
          exit: { y: '100%' },
        }
    }
  }

  return (
    <SheetPortal forceMount>
      <AnimatePresence>
        {open && (
          <>
            <SheetOverlay key="overlay" />
            <SheetPrimitive.Content
              key="content"
              data-slot="sheet-content"
              className={cn(
                'fixed z-50 flex flex-col gap-4 bg-background shadow-lg',
                side === 'bottom' && 'inset-x-0 bottom-0 h-auto border-t',
                side === 'top' && 'inset-x-0 top-0 h-auto border-b',
                side === 'left' && 'inset-y-0 left-0 w-auto border-r',
                side === 'right' && 'inset-y-0 right-0 w-auto border-l',
                className
              )}
              asChild
              onOpenAutoFocus={(event) => {
                event.preventDefault()
                onOpenAutoFocus?.(event)
              }}
              onCloseAutoFocus={(event) => {
                event.preventDefault()
                onCloseAutoFocus?.(event)
              }}
              style={{ ...style, ...safePadForBottom }}
              {...props}
            >
              <motion.div
                {...getMotionProps()}
                transition={{
                  type: 'spring',
                  damping: 30,
                  stiffness: 300,
                }}
              >
                {children}
                <SheetPrimitive.Close className="absolute top-4 right-4 rounded-xs opacity-70 focus:outline-hidden disabled:pointer-events-none">
                  <XIcon className="size-4" />
                  <span className="sr-only">Close</span>
                </SheetPrimitive.Close>
              </motion.div>
            </SheetPrimitive.Content>
          </>
        )}
      </AnimatePresence>
    </SheetPortal>
  )
}

function SheetHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="sheet-header" className={cn('flex flex-col gap-1.5 p-4', className)} {...props} />
}

function SheetFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn(
        'mt-auto flex flex-col gap-2',
        'px-4 pt-4',
        'pr-[calc(1rem_+_var(--safe-right))] pl-[calc(1rem_+_var(--safe-left))]',
        'pb-[calc(var(--safe-bottom)_+_1rem)]',
        className
      )}
      {...props}
    />
  )
}

function SheetTitle({ className, ...props }: React.ComponentProps<typeof SheetPrimitive.Title>) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn('font-semibold text-foreground', className)}
      {...props}
    />
  )
}

function SheetDescription({ className, ...props }: React.ComponentProps<typeof SheetPrimitive.Description>) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  )
}

export { Sheet, SheetTrigger, SheetClose, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription }
