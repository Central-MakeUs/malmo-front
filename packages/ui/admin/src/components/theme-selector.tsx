'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@ui/common/components/select'
import { cn } from '../lib/utils'

const defaultThemes = [
  {
    name: 'Default',
    value: 'default',
  },
  {
    name: 'Neutral',
    value: 'neutral',
  },
  {
    name: 'Stone',
    value: 'stone',
  },
  {
    name: 'Zinc',
    value: 'zinc',
  },
  {
    name: 'Gray',
    value: 'gray',
  },
  {
    name: 'Slate',
    value: 'slate',
  },
  {
    name: 'Scaled',
    value: 'scaled',
  },
]

export function ThemeSelector({
  activeTheme,
  themes = defaultThemes,
  placeHolder = '테마',
  className,
  onChange,
}: {
  activeTheme?: string
  themes?: { name: string; value: string }[]
  onChange?: (theme: string) => void
  placeHolder?: string
  className?: string
}) {
  return (
    <Select value={activeTheme} onValueChange={onChange}>
      <SelectTrigger className={cn('w-24', className)}>
        <SelectValue placeholder={placeHolder} />
      </SelectTrigger>
      <SelectContent align="end">
        {themes.map((theme) => (
          <SelectItem key={theme.name} value={theme.value}>
            {theme.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
