import { forwardRef, useMemo, type HTMLAttributes, type ReactNode } from 'react'

import { useScreenLayoutContext } from './context'

interface ScreenContentProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
}

export const ScreenContent = forwardRef<HTMLDivElement, ScreenContentProps>(function ScreenContent(
  { children, className, style, ...rest },
  ref
) {
  const layout = useScreenLayoutContext()

  const resolvedStyle = useMemo(() => {
    const headerHeight = layout?.headerHeight ?? 0

    if (style?.paddingTop !== undefined) {
      return style
    }

    let paddingTop: string | undefined

    if (layout?.headerBehavior === 'overlay') {
      paddingTop = headerHeight > 0 ? `${headerHeight}px` : 'var(--safe-top)'
    }

    if (!paddingTop && !style) return undefined

    return {
      ...(style ?? {}),
      ...(paddingTop ? { paddingTop } : {}),
    }
  }, [layout?.headerBehavior, layout?.headerHeight, style])

  return (
    <div
      ref={ref}
      data-role="screen-content"
      className={['min-h-0 flex-1 overflow-y-auto', className].filter(Boolean).join(' ')}
      style={resolvedStyle}
      {...rest}
    >
      {children}
    </div>
  )
})
