import { cn } from '@ui/common/lib/utils'

interface ButtonProps {
  text: string
  disabled?: boolean
  onClick: () => void
  className?: string
  type?: 'primary' | 'secondary'
}

export function Button({ text, disabled = false, onClick, className = '', type = 'primary' }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'h-[54px] w-full rounded-lg bg-malmo-rasberry-500 font-semibold text-white',
        {
          'bg-gray-100 text-gray-iron-700': type === 'secondary',
        },
        {
          'cursor-not-allowed bg-gray-neutral-300': disabled,
        },
        className
      )}
    >
      {text}
    </button>
  )
}
