import { cn } from '@/shared/lib/cn'

interface FixedBottomProps {
  children: React.ReactNode
  className?: string
}

export function FixedBottom({ children, className }: FixedBottomProps) {
  return <div className={cn('mt-auto mb-5 px-5 pb-[var(--safe-bottom)]', className)}>{children}</div>
}
