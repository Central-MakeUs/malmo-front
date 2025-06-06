import { AsYouType, CountryCode, getCountries, getCountryCallingCode } from 'libphonenumber-js/mobile'
import React, { useEffect, useMemo, useState } from 'react'
import { cn } from '../lib/utils'
import { Input } from './input'
import { Select } from './select'

export interface InputPhoneInternationalProps {
  locale?: string
  className?: string
  defaultCountryCode?: CountryCode
  selectClassName?: string
  inputClassName?: string
  value?: string
  onChange?: Function
  renderSelect?: (code: string, name: string) => string
}

export function InputPhoneInternational({
  value,
  locale = 'KO',
  defaultCountryCode = 'KR',
  className,
  selectClassName,
  inputClassName,
  onChange,
  renderSelect,
  ...props
}: InputPhoneInternationalProps) {
  const [callingCode, setCallingCode] = useState<string>(
    `${defaultCountryCode},+${getCountryCallingCode(defaultCountryCode)}`
  )
  const [nationalNumber, setNationalNumber] = useState<string>('')

  useEffect(() => {
    if (value) {
      const asYouType = new AsYouType()
      asYouType.input(value)
      if (asYouType.isValid() && asYouType.getNumber()) {
        setCallingCode(`${asYouType.getNumber()!.country},+${asYouType.getNumber()!.countryCallingCode}`)
        setNationalNumber(asYouType.getNumber()!.nationalNumber)
      }
    }
  }, [value])

  function handleChange(value: string) {
    const asYouType = new AsYouType()
    asYouType.input(value)
    if (asYouType.isValid()) {
      onChange?.(asYouType.getNumber()?.number)
    }
  }

  function onChangeCallingCode(value: string) {
    setCallingCode(value)
    if (nationalNumber) {
      const [, code] = value.split(',')
      handleChange(`${code}${nationalNumber}`)
    }
  }

  function onChangeNationalNumber(value: string) {
    setNationalNumber(value?.replace(/[^\d.-]+/g, ''))
    const [, code] = callingCode.split(',')
    handleChange(`${code}${value}`)
  }

  const selectOptions = useMemo(() => {
    const regionNames = new Intl.DisplayNames([locale], { type: 'region' })
    const countries = getCountries()
      .map((country) => ({ code: country, name: regionNames.of(country) }))
      .filter((country) => !!country.name)

    countries.sort((a, b) => {
      if (a.code === defaultCountryCode) return -1
      if (b.code === defaultCountryCode) return 1
      return a.name!.localeCompare(b.name!)
    })
    return countries.map((country) => {
      const callingCode = getCountryCallingCode(country.code)
      return {
        value: `${country.code},+${callingCode}`,
        label: renderSelect?.(callingCode, country.name!) || `${country.name} (+${callingCode})`,
      }
    })
  }, [locale])

  return (
    <div className={cn('flex flex-row gap-3', className)} {...props}>
      <Select
        className={cn(selectClassName)}
        options={selectOptions}
        value={callingCode}
        onChange={onChangeCallingCode}
      />
      <Input
        className={cn('w-60', inputClassName)}
        placeholder="-없이 연락가능한 전화번호"
        value={nationalNumber}
        onChange={(e) => onChangeNationalNumber(e.target.value)}
      />
    </div>
  )
}
