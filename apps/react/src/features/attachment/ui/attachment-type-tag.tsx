import type { AttachmentTypePreviewItem } from '@/features/attachment/models/love-type-catalog'

interface AttachmentTypeTagProps {
  type: AttachmentTypePreviewItem
}

export function AttachmentTypeTag({ type }: AttachmentTypeTagProps) {
  return (
    <div className="flex items-center">
      <div className={`flex h-[24px] w-[50px] items-center justify-center rounded-[8px] ${type.bgColor}`}>
        <span className={`text-[12px] font-medium ${type.textColor}`}>{type.name}</span>
      </div>
      <p className="body3-medium ml-[16px] text-gray-iron-800">{type.description}</p>
    </div>
  )
}
