import AnxietyIcon from '@/assets/icons/anxiety.svg'
import AvoidanceIcon from '@/assets/icons/avoidance.svg'
import type { GetLoveTypeData } from '@data/user-api-axios/api'

interface ResultScoreBoxProps {
  loveTypeData: GetLoveTypeData
}

export function ResultScoreBox({ loveTypeData }: ResultScoreBoxProps) {
  return (
    <div className="flex h-[70px] items-center gap-[20px] rounded-[12px] bg-gray-neutral-100 px-[20px]">
      {/* 불안 점수 */}
      <div className="flex flex-1 items-center justify-between">
        <div className="flex items-center">
          <AnxietyIcon className="h-[24px] w-[24px]" />
          <span className="body3-medium ml-[8px] text-gray-iron-950">불안</span>
        </div>
        <div className="flex items-center">
          <span className="heading1-bold text-gray-iron-950">
            {loveTypeData.memberAnxietyScore?.toFixed(2) || '0.00'}
          </span>
          <span className="label1-medium mt-[2px] ml-[4px] text-gray-iron-400">/ 5</span>
        </div>
      </div>

      {/* 구분선 */}
      <hr className="h-[38px] w-[1px] border-0 bg-gray-iron-300" />

      {/* 회피 점수 */}
      <div className="flex flex-1 items-center justify-between">
        <div className="flex items-center">
          <AvoidanceIcon className="h-[24px] w-[24px]" />
          <span className="body3-medium ml-[8px] text-gray-iron-950">회피</span>
        </div>
        <div className="flex items-center">
          <span className="heading1-bold text-gray-iron-950">
            {loveTypeData.memberAvoidanceScore?.toFixed(2) || '0.00'}
          </span>
          <span className="label1-medium mt-[2px] ml-[4px] text-gray-iron-400">/ 5</span>
        </div>
      </div>
    </div>
  )
}
