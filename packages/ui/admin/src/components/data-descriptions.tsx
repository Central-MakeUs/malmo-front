import React from 'react'
import { DataModalDescriptions } from './data-modal'
import { Descriptions } from './descriptions'

export function DataDescriptions<T extends Record<string, any>>({
  record,
  children,
  descriptions,
}: {
  record?: T
  children?: React.ReactNode
  descriptions?: DataModalDescriptions<T>[]
}) {
  return (
    <>
      {children}
      {descriptions?.map((desc, i) => {
        const { items, ...props } = desc
        return (
          <Descriptions
            key={i}
            {...props}
            items={items.map((item, i) => {
              const { header, ...rest } = item
              const value = record?.[item.accessorKey] ?? '-'
              return {
                ...rest,
                label: header || item.accessorKey,
                children: item.render ? item.render(value, record as T, i) : value,
              }
            })}
          />
        )
      })}
    </>
  )
}
