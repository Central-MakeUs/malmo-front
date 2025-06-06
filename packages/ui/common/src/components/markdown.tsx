'use client'

import { MDXProvider, Props } from '@mdx-js/react'

export function Markdown({ children, ...props }: Props) {
  return <MDXProvider {...props}>{children}</MDXProvider>
}
