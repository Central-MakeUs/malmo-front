'use client'

import { format } from 'date-fns'
import { enUS, ko } from 'date-fns/locale'
import { Calendar as CalendarIcon } from 'lucide-react'
import * as React from 'react'
import { useEffect } from 'react'

import { cn } from '../lib/utils'
import { Button } from './button'
import { Calendar } from './calendar'
import { Popover, PopoverContent, PopoverTrigger } from './popover'

const SUPPORTED_LOCALES = {
  ko,
  en: enUS,
}

export interface DatePickerProps {
  className?: string
  locale?: 'ko' | 'en'
  dateFormat?: string
  placeholder?: string
  value?: string
  onChange?: (value?: string) => void
  disabled?: boolean
  calendarProps?: Pick<
    React.ComponentProps<typeof Calendar>,
    'classNames' | 'dateFormat' | 'disabled' | 'hidden' | 'today'
  >
}

export function DatePicker({
  className,
  onChange,
  value,
  dateFormat,
  placeholder = '날짜를 선택하세요',
  disabled,
  calendarProps,
  ...props
}: DatePickerProps) {
  const [date, setDate] = React.useState<Date>()
  const locale = props.locale ? SUPPORTED_LOCALES[props.locale] : ko

  useEffect(() => {
    if (value) {
      setDate(new Date(value))
    }
  }, [value])

  function handleDateChange(date?: Date) {
    if (value !== date) {
      setDate(date)
      onChange?.(date?.toISOString())
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild disabled={disabled}>
        <Button
          variant={'outline'}
          className={cn('w-[280px] justify-start text-left font-normal', className, !date && 'text-muted-foreground')}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, 'PPP', { locale }) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          locale={locale}
          mode="single"
          selected={date}
          onSelect={(date) => handleDateChange(date)}
          initialFocus
          {...calendarProps}
        />
      </PopoverContent>
    </Popover>
  )
}
