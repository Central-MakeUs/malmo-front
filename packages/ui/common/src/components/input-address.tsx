'use client'

import React, { useMemo } from 'react'
import { cn } from '../lib/utils'
import { Button } from './button'
import { Input } from './input'

declare global {
  interface Window {
    daum: any
  }
}

interface InputAddressProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onChangeSido?: (value: string) => void
  onChangeAddress?: (value: string) => void
}

const InputAddress = React.forwardRef<HTMLDivElement, InputAddressProps>(
  ({ className, onChange, onChangeSido, onChangeAddress, ...props }, ref) => {
    function handleDaumAddress() {
      if (window.daum) {
        new window.daum.Postcode({
          oncomplete: (data: any) => {
            onChange?.(data.zonecode)
            onChangeSido?.(data.sido)
            onChangeAddress?.(data.address)
          },
        }).open()
      }
    }

    const buttonClassName = useMemo(() => {
      if (props.value) return ''
      return cn('border-primary bg-background text-primary')
    }, [props.value])

    return (
      <>
        <div className={cn('flex flex-row gap-[8px]', className)} ref={ref} {...props}>
          <Input placeholder="우편번호" disabled {...props} />
          <Button className={buttonClassName} variant="secondary" size="default" onClick={handleDaumAddress}>
            주소검색
          </Button>
        </div>
      </>
    )
  }
)

InputAddress.displayName = 'InputAddress'

export { InputAddress }
