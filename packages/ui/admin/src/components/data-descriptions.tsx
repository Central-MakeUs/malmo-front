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
            className="whitespace-pre-wrap"
            key={i}
            {...props}
            items={items.map((item, i) => {
              const { header, ...rest } = item
              const value = record?.[item.accessorKey] ?? '-'
              return {
                ...rest,
                span: item.span || 2,
                label: header || item.accessorKey,
                children: item.render ? (
                  item.render(value, record as T, i)
                ) : (
                  <p className="whitespace-pre-wrap">{value}</p>
                ),
              }
            })}
          />
        )
      })}
    </>
  )
}
