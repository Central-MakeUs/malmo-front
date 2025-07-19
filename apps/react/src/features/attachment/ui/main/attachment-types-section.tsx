import { SectionHeader } from '../section-header'
import { AttachmentTypeTag } from '../attachment-type-tag'
import { ATTACHMENT_TYPE_PREVIEW } from '../../models/attachment-data'

export function AttachmentTypesSection() {
  return (
    <div className="mt-[72px]">
      <SectionHeader title="애착유형에는 무엇이 있나요?" />

      <div className="mt-[28px]">
        {ATTACHMENT_TYPE_PREVIEW.map((type, index) => (
          <div key={index}>
            <AttachmentTypeTag type={type} />
            {index < ATTACHMENT_TYPE_PREVIEW.length - 1 && (
              <>
                <div className="mt-[16px]" />
                <div className="h-[1px] w-full bg-gray-iron-100" />
                <div className="mt-[16px]" />
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
