interface ButtonProps {
  text: string
  disabled?: boolean
  onClick: () => void
  className?: string
}

export function Button({ text, disabled = false, onClick, className = '' }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`h-[54px] w-full rounded-lg font-semibold text-white ${
        !disabled ? 'bg-malmo-rasberry-500' : 'bg-gray-neutral-300'
      } ${className}`}
    >
      {text}
    </button>
  )
}
