import * as Regex from '@data/utils/regex'
import { removeNonNumeric } from '@data/utils/string'
import React, { useMemo } from 'react'
import { cn } from '../lib/utils'
import { Button } from './button'
import CountDown from './count-down'
import { Input } from './input'

interface InputPasscodeProps {
  name?: string
  className?: string
  value?: string
  verified?: boolean
  placeholder?: string
  passCodeExpireAt?: Date | null
  onChange?: (value: string) => void
  onConfirm?: () => void
}

const InputPasscode = React.forwardRef<HTMLInputElement, InputPasscodeProps>(
  ({ className, placeholder, onChange, onConfirm, verified, passCodeExpireAt, ...props }, ref) => {
    function handleChange(value: string) {
      onChange?.(removeNonNumeric(value))
    }

    function handleClick() {
      onConfirm?.()
    }

    const validInput = useMemo(() => {
      return Regex.verificationCode.test(props.value!)
    }, [props.value])

    return (
      <div className={cn('flex flex-row gap-[8px]', className)} ref={ref} {...props}>
        <div className="relative w-full">
          <Input
            className="pr-[100px]"
            inputMode="numeric"
            maxLength={6}
            placeholder={placeholder}
            {...props}
            disabled={verified}
            onChange={(e) => handleChange(e.target.value)}
          />
          <div className="absolute inset-y-0 right-2 flex items-center justify-between gap-2">
            {!verified && passCodeExpireAt && <CountDown date={passCodeExpireAt} />}
            <Button
              variant="secondary"
              size="sm"
              disabled={!validInput || verified}
              className="h-[32px]"
              onClick={handleClick}
            >
              확인
            </Button>
          </div>
        </div>
      </div>
    )
  }
)

InputPasscode.displayName = 'InputPhone'

export { InputPasscode }
