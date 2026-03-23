import { Fragment } from 'react'

import { cn } from '@/shared/lib/cn'

interface FlowProgressBarProps {
  step: number
  total: number
  highlightSteps?: number[]
}

export function FlowProgressBar({ step, total, highlightSteps }: FlowProgressBarProps) {
  return (
    <div className="flex flex-1 items-center gap-2">
      <div className="flex flex-1 items-center">
        {Array.from({ length: total }, (_, i) => {
          const isActive = i < step
          const isHighlighted = highlightSteps?.includes(i + 1)

          return (
            <Fragment key={i}>
              {i > 0 && (
                <div className={cn('h-[2px] flex-1', isActive ? 'bg-malmo-rasberry-500' : 'bg-gray-neutral-300')} />
              )}
              {isHighlighted ? (
                <div className="relative flex h-4 w-4 shrink-0 items-center justify-center">
                  <div
                    className={cn(
                      'absolute inset-0 rounded-full',
                      isActive ? 'bg-malmo-rasberry-50' : 'bg-gray-neutral-100'
                    )}
                  />
                  <div
                    className={cn(
                      'relative h-2 w-2 rounded-full',
                      isActive ? 'bg-malmo-rasberry-500' : 'bg-gray-neutral-300'
                    )}
                  />
                </div>
              ) : (
                <div
                  className={cn(
                    'h-2 w-2 shrink-0 rounded-full',
                    isActive ? 'bg-malmo-rasberry-500' : 'bg-gray-neutral-300'
                  )}
                />
              )}
            </Fragment>
          )
        })}
      </div>
      <span className="body3-medium shrink-0 text-gray-iron-500">
        {step} / {total}
      </span>
    </div>
  )
}

/** chat-entry flow에서 공통으로 사용하는 진행 바를 반환합니다. */
export function getChatEntryProgressBar(isChatEntry: boolean, step: number) {
  return isChatEntry ? <FlowProgressBar step={step} total={5} highlightSteps={[3, 5]} /> : undefined
}
