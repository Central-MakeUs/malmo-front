'use client'

import { Table, TableBody, TableCell, TableHead, TableRow } from '@ui/common/components/table'
import * as React from 'react'
import { cn } from '../lib/utils'

/** Tailwind v4 기본 브레이크포인트 */
const tailwindBreakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
}

/** size 옵션 */
function getSizeClasses(size: 'default' | 'middle' | 'small') {
  switch (size) {
    case 'small':
      return 'px-2 py-1 text-sm'
    case 'middle':
      return 'px-3 py-2'
    default:
      return 'px-4 py-2'
  }
}

/** span 옵션 (number | "filled" | 반응형) */
type ResponsiveNumber = number | Partial<Record<keyof typeof tailwindBreakpoints, number>>

export interface DescriptionItemProps {
  label: React.ReactNode
  span?: number | 'filled' | ResponsiveNumber
  children: React.ReactNode
}

export interface DescriptionsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: React.ReactNode
  bordered?: boolean
  colon?: boolean
  column?: number | ResponsiveNumber
  size?: 'default' | 'middle' | 'small'
  extra?: React.ReactNode
  items: DescriptionItemProps[]
  labelClassName?: string
}

export function Descriptions({
  title,
  bordered = false,
  colon = true,
  column = {
    sm: 1,
    md: 2,
  },
  size = 'default',
  extra,
  items,
  children,
  ...props
}: DescriptionsProps) {
  const realColumn = useResponsiveColumn(column)

  const blocks: DescriptionItemProps[][] = []
  {
    let row: DescriptionItemProps[] = []
    let used = 0
    for (const item of items) {
      const sp = getSpanValue(item.span, realColumn - used)
      if (used + sp > realColumn) {
        blocks.push(row)
        row = [item]
        used = sp
      } else {
        row.push(item)
        used += sp
      }
      if (used === realColumn) {
        blocks.push(row)
        row = []
        used = 0
      }
    }
    if (row.length > 0) blocks.push(row)
  }

  const sizeCls = getSizeClasses(size)

  return (
    <div className="flex w-full flex-col space-y-2" {...props}>
      {(title || extra) && (
        <div className="flex items-center justify-between">
          {title && <div className="text-md font-semibold">{title}</div>}
          {extra && <div>{extra}</div>}
        </div>
      )}

      <div className={cn(bordered && 'rounded-sm border border-border')}>
        <Table className={cn('w-full border-collapse border-hidden')}>
          <TableBody>
            {blocks.map((block, rowIndex) => {
              const usedSum = block.reduce((acc, it) => acc + getSpanValue(it.span, realColumn - acc), 0)
              const leftover = realColumn - usedSum

              return (
                <TableRow key={rowIndex} className={cn(bordered ? 'border' : 'border-0')}>
                  {block.map((it, i) => {
                    const isLast = i === block.length - 1 && leftover > 0
                    const spanValue = getSpanValue(it.span, realColumn - usedSum)
                    const labelColSpan = 1
                    const contentColSpan = isLast ? leftover * 2 + 1 : spanValue * 2 - 1

                    return bordered
                      ? [
                          <TableHead
                            key={`label-${i}`}
                            colSpan={labelColSpan}
                            className={cn(
                              sizeCls,
                              'align-middle font-medium',
                              'border border-ring/20 bg-muted/50 text-muted-foreground'
                            )}
                          >
                            {it.label}
                          </TableHead>,

                          <TableCell
                            key={`value-${i}`}
                            colSpan={contentColSpan}
                            className={cn(sizeCls, 'border border-ring/20')}
                          >
                            {it.children ?? '—'}
                          </TableCell>,
                        ]
                      : [
                          <TableCell key={`cell-${i}`} colSpan={contentColSpan} className={cn(sizeCls, 'border-0')}>
                            {it.label}
                            {!bordered && colon && `：`}
                            {it.children ?? '—'}
                          </TableCell>,
                        ]
                  })}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

/** 반응형 column */
function useResponsiveColumn(column: number | ResponsiveNumber) {
  const [val, setVal] = React.useState<number>(typeof column === 'number' ? column : 1)
  React.useEffect(() => {
    if (typeof column === 'number') {
      setVal(column)
      return
    }

    function handleResize() {
      const w = window.innerWidth
      let newVal = 1
      for (const bp of ['sm', 'md', 'lg', 'xl', '2xl'] as const) {
        const px = tailwindBreakpoints[bp]
        if (px && w >= px && column[bp]) {
          newVal = column[bp]!
        }
      }
      setVal(newVal)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [column])

  return val
}

function getSpanValue(span: DescriptionItemProps['span'], remain: number): number {
  if (!span) return 1
  if (typeof span === 'number') return span
  if (span === 'filled') return remain
  if (typeof span === 'object') {
    return 1
  }
  return 1
}
