import { LucideIcon } from 'lucide-react'
import { Link, useRouterState } from '@tanstack/react-router'
import React from 'react'
import { cn } from '@ui/common/lib/utils'

interface NavigationIconProps {
  icon: LucideIcon
  className?: string
  onClick?: () => void
  url?: string
  text?: string
}

export function NavgationIcon(props: NavigationIconProps) {
  const { icon: Icon, className, onClick, url, text } = props
  const routerState = useRouterState()
  const currentPathname = routerState.location.pathname

  const isActive = url
    ? url === '/'
      ? currentPathname === '/'
      : currentPathname === url || currentPathname.startsWith(`${url}/`)
    : false

  return (
    <Link to={url} className="flex h-20 w-20 items-center justify-center">
      <div
        className={cn(
          'flex flex-col items-center justify-center gap-1',
          {
            'text-black': isActive,
            'text-gray-400': !isActive,
          },
          className
        )}
        onClick={onClick}
      >
        <Icon />
        <p className="text-sm">{text}</p>
      </div>
    </Link>
  )
}
