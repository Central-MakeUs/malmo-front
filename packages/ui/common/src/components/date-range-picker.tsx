'use client'

import { format } from 'date-fns'
import { enUS, ko } from 'date-fns/locale'
import { Calendar as CalendarIcon } from 'lucide-react'
import * as React from 'react'
import { useEffect } from 'react'
import { DateRange } from 'react-day-picker'
import { cn } from '../lib/utils'
import { Button } from './button'
import { Calendar } from './calendar'
import { Popover, PopoverContent, PopoverTrigger } from './popover'

const SUPPORTED_LOCALES = {
  ko,
  en: enUS,
}

export interface DateRangePickerProps {
  className?: string
  locale?: 'ko' | 'en'
  dateFormat?: string
  placeholder?: string
  value?: { from?: string; to?: string }
  onChange?: (value?: { from?: string; to?: string }) => void
  disabled?: boolean
  calendarProps?: Pick<
    React.ComponentProps<typeof Calendar>,
    'classNames' | 'dateFormat' | 'disabled' | 'hidden' | 'today'
  >
}

export function DateRangePicker({
  value,
  className,
  disabled,
  dateFormat = 'PPP',
  placeholder = '날짜를 선택하세요.',
  onChange,
  calendarProps,
  ...props
}: DateRangePickerProps) {
  const locale = props.locale ? SUPPORTED_LOCALES[props.locale] : ko

  const [date, setDate] = React.useState<DateRange | undefined>()

  useEffect(() => {
    setDate({
      from: value?.from ? new Date(value.from) : undefined,
      to: value?.to ? new Date(value.to) : undefined,
    })
  }, [value])

  function handleChange(value?: DateRange) {
    setDate(value)
    onChange?.({
      from: value?.from?.toISOString(),
      to: value?.to?.toISOString(),
    })
  }

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild disabled={disabled}>
          <Button
            id="date"
            variant={'outline'}
            className={cn('w-[300px] justify-start text-left font-normal', className, !date && 'text-muted-foreground')}
          >
            <CalendarIcon />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, dateFormat, { locale })} - {format(date.to, dateFormat, { locale })}
                </>
              ) : (
                format(date.from, dateFormat, { locale })
              )
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            locale={locale}
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleChange}
            numberOfMonths={2}
            {...calendarProps}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
