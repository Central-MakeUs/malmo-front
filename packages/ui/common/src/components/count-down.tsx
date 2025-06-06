'use client'

import React, { useMemo } from 'react'
import { useCountDown } from '../hooks/count-down.hook'
import { cn } from '../lib/utils'

interface PassCodeCountDownProps {
  className?: string
  date: Date
}

export default function CountDown(props: PassCodeCountDownProps) {
  const [, , minutes, seconds] = useCountDown(props.date)

  const active = useMemo(() => minutes + seconds > 0, [minutes, seconds])

  const className = useMemo(() => {
    const ret = ['text-body-02']
    if (active) ret.push('text-destructive')
    else ret.push('text-muted-foreground')
    return ret.join(' ')
  }, [active])

  return (
    <span className={cn(props.className, className)}>
      {active ? `${minutes}:${String(seconds).padStart(2, '0')}` : '0:00'}
    </span>
  )
}
