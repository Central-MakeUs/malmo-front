import { cn } from '@/shared/lib/cn'

interface FlowStepDotsProps {
  step: number
  total: number
}

export function FlowStepDots({ step, total }: FlowStepDotsProps) {
  return (
    <div className="flex items-center gap-[6px] px-5 pt-4 pb-1">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={cn('h-[10px] w-[10px] rounded-full', i < step ? 'bg-malmo-rasberry-500' : 'bg-gray-neutral-300')}
        />
      ))}
      <span className="body3-medium ml-1 text-gray-iron-950">{step}단계</span>
    </div>
  )
}

/** my-personality / partner-personality flow에서 공통으로 사용하는 단계 dots를 반환합니다. */
export function getPersonalityStepDots(isCurrentFlow: boolean, step: number) {
  return isCurrentFlow ? <FlowStepDots step={step} total={2} /> : undefined
}
