import StepsIcon from '@/assets/icons/steps.svg'
import { cn } from '@/shared/lib/cn'

interface FlowStepDotsProps {
  step: number
  total: number
}

export function FlowStepDots({ step, total }: FlowStepDotsProps) {
  return (
    <div className="absolute flex items-center gap-[2px] px-5 pt-[8px]">
      {Array.from({ length: total }, (_, i) => (
        <StepsIcon
          key={i}
          width={15}
          height={16}
          className={cn(i < step ? 'text-malmo-rasberry-500' : 'text-gray-iron-200')}
        />
      ))}
      <span className="body3-medium ml-[6px] text-gray-iron-950">{step}단계</span>
    </div>
  )
}

/** my-personality / partner-personality flow에서 공통으로 사용하는 단계 dots를 반환합니다. */
export function getPersonalityStepDots(isCurrentFlow: boolean, step: number) {
  return isCurrentFlow ? <FlowStepDots step={step} total={2} /> : undefined
}
