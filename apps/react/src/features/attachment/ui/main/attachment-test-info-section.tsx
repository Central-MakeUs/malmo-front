import { ATTACHMENT_TEST_INFO } from '../../models/attachment-data'
import { InfoBox } from '../info-box'
import { SectionHeader } from '../section-header'

export function AttachmentTestInfoSection() {
  return (
    <div>
      <SectionHeader title="애착유형 검사는 무엇인가요?" />

      <div className="mt-[28px] space-y-[12px]">
        {ATTACHMENT_TEST_INFO.map((info, index) => (
          <InfoBox key={index}>{info}</InfoBox>
        ))}
      </div>
    </div>
  )
}
