import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  type?: 'text' | 'password'
}

export function Input({ className = '', value, onChange, placeholder, type = 'text', ...restProps }: InputProps) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`h-[60px] w-full rounded-[8px] border border-gray-neutral-300 px-5 text-gray-iron-950 placeholder:text-gray-iron-400 focus:border-malmo-rasberry-500 focus:outline-none ${className}`}
      {...restProps}
    />
  )
}
