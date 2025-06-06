import React, { useEffect, useState } from 'react'
import { cn } from '../lib/utils'
import { Select } from './select'

interface InputBirthdayProps {
  name?: string
  className?: string
  value?: string
  'data-error'?: boolean
  onChange?: (value: string) => void
}

const generateYearOptions = () => {
  const currentYear = new Date().getFullYear()
  return Array.from({ length: 100 }, (_, i) => {
    const year = (currentYear - i).toString()
    return { value: year, label: year }
  })
}

const generateMonthOptions = () => {
  return Array.from({ length: 12 }, (_, i) => {
    const month = (i + 1).toString().padStart(2, '0')
    return { value: month, label: month }
  })
}

const generateDayOptions = () => {
  return Array.from({ length: 31 }, (_, i) => {
    const day = (i + 1).toString().padStart(2, '0')
    return { value: day, label: day }
  })
}

const InputBirthday = React.forwardRef<HTMLInputElement, InputBirthdayProps>(
  ({ className, onChange, 'data-error': dataError, ...props }, ref) => {
    const [year, setYear] = useState('')
    const [month, setMonth] = useState('')
    const [day, setDay] = useState('')

    useEffect(() => {
      if (typeof props.value === 'string' && props.value.length === 10) {
        const year = props.value.substring(0, 4)
        const month = props.value.substring(5, 7)
        const day = props.value.substring(8)
        setYear(year)
        setMonth(month)
        setDay(day)
      }
    }, [props.value])

    function handleChange(updatedYear?: string, updatedMonth?: string, updatedDay?: string) {
      const newYear = updatedYear ?? year
      const newMonth = updatedMonth ?? month
      const newDay = updatedDay ?? day
      onChange?.(`${newYear}-${newMonth}-${newDay}`)
    }

    return (
      <div className={cn('flex flex-row gap-[8px]', className)} ref={ref} {...props}>
        <Select
          placeholder="년도"
          data-error={dataError && year?.length !== 4}
          value={year}
          onValueChange={(value) => {
            setYear(value)
            handleChange(value, undefined, undefined)
          }}
          options={generateYearOptions()}
        />
        <Select
          placeholder="월"
          data-error={dataError && month?.length !== 2}
          value={month}
          onValueChange={(value) => {
            setMonth(value)
            handleChange(undefined, value, undefined)
          }}
          options={generateMonthOptions()}
        />
        <Select
          placeholder="일"
          data-error={dataError && day?.length !== 2}
          value={day}
          onValueChange={(value) => {
            setDay(value)
            handleChange(undefined, undefined, value)
          }}
          options={generateDayOptions()}
        />
      </div>
    )
  }
)

InputBirthday.displayName = 'InputBirthday'

export { InputBirthday }
