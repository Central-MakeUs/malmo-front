import type { AttachmentTypeData } from '../../models/types'

interface ResultDetailBoxProps {
  attachmentData: AttachmentTypeData
}

export function ResultDetailBox({ attachmentData }: ResultDetailBoxProps) {
  return (
    <div className="mt-[16px] rounded-[12px] bg-gray-neutral-100 px-[20px] pt-[28px] pb-[40px]">
      {/* 애착유형 태그 */}
      <div className="flex justify-center">
        <div className="rounded-[19.5px] bg-gray-iron-700 px-[16px] py-[8px]">
          <span className="body3-medium text-white">
            {attachmentData.character} - {attachmentData.subtype}
          </span>
        </div>
      </div>

      {/* 점수 설명 */}
      <div className="mt-[12px] text-center">
        <span className="body3-medium text-gray-iron-500">
          불안 점수 {attachmentData.anxietyThreshold} / 회피 점수 {attachmentData.avoidanceThreshold}
        </span>
      </div>

      {/* 설명 텍스트 */}
      <div className="mt-[32px]">
        <p className="body2-reading-regular whitespace-pre-line text-gray-iron-900">{attachmentData.description}</p>
      </div>
    </div>
  )
}
