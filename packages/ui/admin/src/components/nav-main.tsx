'use client'

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@ui/common/components/collapsible'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@ui/common/components/dropdown-menu'
import { ChevronRight, type LucideIcon } from 'lucide-react'
import * as React from 'react'
import { ReactNode } from 'react'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@ui/common/components/sidebar'

interface NavMainProps {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    close?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
  linkRender?: (item: { title: string; url: string; icon?: LucideIcon }) => ReactNode
}

export function NavMain(props: NavMainProps) {
  const { items, linkRender } = props
  const sidebar = useSidebar()

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          if (!item.items?.length) {
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild tooltip={item.title}>
                  {linkRender ? (
                    linkRender({ title: item.title, url: item.url, icon: item.icon })
                  ) : (
                    <a href={item.url}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </a>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          }
          if (sidebar.state === 'collapsed' && item.icon) {
            return (
              <DropdownMenu key={item.title}>
                <SidebarMenuItem>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton
                      className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                      tooltip={item.title}
                    >
                      {<item.icon />}
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  {item.items?.length ? (
                    <DropdownMenuContent
                      side={sidebar.isMobile ? 'bottom' : 'right'}
                      align={sidebar.isMobile ? 'end' : 'start'}
                      className="min-w-56 rounded-lg"
                    >
                      {item.items.map((item) => (
                        <DropdownMenuItem asChild key={item.title}>
                          {linkRender ? (
                            linkRender({ title: item.title, url: item.url })
                          ) : (
                            <a href={item.url}>{item.title}</a>
                          )}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  ) : null}
                </SidebarMenuItem>
              </DropdownMenu>
            )
          }

          return (
            <Collapsible key={item.title} asChild defaultOpen={!item.close} className="group/collapsible">
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.title}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild>
                          {linkRender ? (
                            linkRender({ title: subItem.title, url: subItem.url })
                          ) : (
                            <a href={subItem.url}>
                              <span>{subItem.title}</span>
                            </a>
                          )}
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
