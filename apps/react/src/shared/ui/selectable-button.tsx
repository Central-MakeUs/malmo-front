import { cn } from '@/shared/lib/cn'

interface SelectableButtonProps {
  selected: boolean
  onClick: () => void
  children: React.ReactNode
  className?: string
  disabled?: boolean
}

export function SelectableButton({ selected, onClick, children, className, disabled }: SelectableButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'rounded-[10px] border px-5 py-4 text-center transition-all',
        'body2-medium',
        selected ? 'border-malmo-rasberry-500 text-malmo-rasberry-500' : 'border-gray-neutral-300 text-gray-iron-500',
        className
      )}
    >
      {children}
    </button>
  )
}
