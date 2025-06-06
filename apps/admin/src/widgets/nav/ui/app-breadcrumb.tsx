import { Link, useMatches } from '@tanstack/react-router'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@ui/common/components/breadcrumb'
import { match } from 'path-to-regexp'
import React from 'react'
import { navData } from '../model'

function matchRoute(url: string, path: string) {
  return path.startsWith(url) || match(url.replace(/\$(\w+)/g, ':$1'))(path)
}

export function AppBreadcrumb() {
  const matches = useMatches()
  const currentPath = matches[matches.length - 1]?.pathname ?? '/'

  const breadcrumbItems: { title: string; url: string }[] = []
  for (const item of navData.navMain) {
    if (matchRoute(item.url, currentPath)) {
      breadcrumbItems.push({
        title: item.title,
        url: item.url,
      })
      if (item.items) {
        const subItem = item.items.find((sub) => matchRoute(sub.url, currentPath))
        if (subItem) {
          breadcrumbItems.push({
            title: subItem.title,
            url: subItem.url,
          })
          if (subItem.items) {
            const lastItem = subItem.items.find((sub) => matchRoute(sub.url, currentPath))
            if (lastItem) {
              breadcrumbItems.push({
                title: lastItem.title,
                url: lastItem.url,
              })
            }
          }
        }
      }
      break
    }
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbItems.map((item, index) => {
          if (index === breadcrumbItems.length - 1) {
            return (
              <React.Fragment key={item.url}>
                <BreadcrumbItem>
                  <BreadcrumbPage>{item.title}</BreadcrumbPage>
                </BreadcrumbItem>
              </React.Fragment>
            )
          }
          return (
            <React.Fragment key={item.url}>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href={item.url} asChild>
                  <Link to={item.url}>{item.title}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
            </React.Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
