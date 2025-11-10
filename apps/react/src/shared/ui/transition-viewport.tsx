import { ReactNode } from 'react'

export function TransitionViewport({ children }: { children: ReactNode }) {
  return <div className="relative flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden">{children}</div>
}
