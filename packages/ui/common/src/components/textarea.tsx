import * as React from 'react'

import { cn } from '../lib/utils'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  showCount?: boolean
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, showCount = false, onChange, ...props }, ref) => {
    const [count, setCount] = React.useState(
      props.value?.toString().length || props.defaultValue?.toString().length || 0
    )

    React.useEffect(() => {
      if (props.value !== undefined) {
        setCount(props.value.toString().length)
      }
    }, [props.value])

    const handleOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCount(e.target.value.length)

      if (onChange) {
        onChange(e)
      }
    }

    return (
      <div className="relative flex w-full">
        <textarea
          className={cn(
            'flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
            className,
            { 'mb-2': showCount }
          )}
          ref={ref}
          onChange={handleOnChange}
          {...props}
        />
        {showCount && (
          <div className="absolute right-0 bottom-[-14px] text-sm text-muted-foreground">
            {count}
            {props.maxLength ? ` / ${props.maxLength}` : ''}
          </div>
        )}
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'

export { Textarea }
