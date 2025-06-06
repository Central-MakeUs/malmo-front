import * as Regex from '@data/utils/regex'
import { removeNonNumeric } from '@data/utils/string'
import React, { useEffect, useMemo, useState } from 'react'
import { cn } from '../lib/utils'
import { Button } from './button'
import { Input } from './input'
import { Select } from './select'

export interface InputPhoneProps {
  name?: string
  className?: string
  value?: string
  sentPasscode?: boolean
  verified?: boolean
  placeholder?: string
  onChange?: (value: string) => void
  onClickVerify: () => void
}

const phonePrefix = [
  { value: '010' },
  { value: '011' },
  { value: '016' },
  { value: '017' },
  { value: '018' },
  { value: '019' },
]

const InputPhone = React.forwardRef<HTMLDivElement, InputPhoneProps>(
  ({ className, placeholder, onChange, onClickVerify, sentPasscode, verified, ...props }, ref) => {
    const [prefix, setPrefix] = useState('010')
    const [phoneNumber, setPhoneNumber] = useState('')

    useEffect(() => {
      if (typeof props.value === 'string') {
        const prefix = props.value.substring(0, 3)
        if (prefix.length === 3) {
          const phoneNumber = props.value.substring(3)
          setPrefix(prefix)
          setPhoneNumber(phoneNumber)
        } else {
          setPrefix('010')
        }
      }
    }, [props.value])

    const validInput = useMemo(() => {
      return Regex.phone.test(props.value!)
    }, [props.value])

    function handleChange(value: string) {
      onChange?.(value)
    }

    function handleChangePrefix(value: string) {
      setPrefix(value)
      handleChange(`${prefix}${phoneNumber}`)
    }

    function handleChangePhoneNumber(value: string) {
      setPhoneNumber(removeNonNumeric(value))
      handleChange(`${prefix}${value}`)
    }

    const buttonClassName = useMemo(() => {
      if (sentPasscode) return ''
      return cn('border-primary bg-background text-primary')
    }, [props.value, sentPasscode])

    return (
      <div className={cn('flex flex-row gap-[8px]', className)} ref={ref} {...props}>
        <Select
          className="w-[100px] text-body-01"
          options={phonePrefix}
          onValueChange={handleChangePrefix}
          value={prefix}
        />
        <div className="relative w-full">
          <Input
            className="pr-[100px]"
            inputMode="numeric"
            placeholder={placeholder}
            maxLength={8}
            {...props}
            value={phoneNumber}
            onChange={(e) => handleChangePhoneNumber(e.target.value)}
          />
          <Button
            variant="secondary"
            size="sm"
            disabled={!validInput || verified}
            className={cn(buttonClassName, 'absolute top-1/2 right-2 h-[32px] -translate-y-1/2')}
            onClick={onClickVerify}
          >
            {sentPasscode ? '재전송' : '인증하기'}
          </Button>
        </div>
      </div>
    )
  }
)

InputPhone.displayName = 'InputPhone'

export { InputPhone }
