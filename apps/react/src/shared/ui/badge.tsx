import { cn } from '@ui/common/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'completed' | 'required'
  className?: string
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants = {
    default: 'bg-gray-neutral-200 text-gray-iron-600',
    completed: 'bg-malmo-orange-50 text-malmo-orange-500',
    required: 'bg-gray-neutral-200 text-gray-iron-600',
  }

  return (
    <div className={cn('inline-flex items-center rounded-[8px] px-[9px] py-[1px]', variants[variant], className)}>
      <span className="label1-semibold">{children}</span>
    </div>
  )
}
