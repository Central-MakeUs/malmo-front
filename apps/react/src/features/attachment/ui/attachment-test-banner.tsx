import { ChevronRight } from 'lucide-react'

import noteImage from '@/assets/images/note-home.png'
import { wrapWithTracking } from '@/shared/analytics'
import { BUTTON_NAMES, CATEGORIES } from '@/shared/analytics/constants'

interface AttachmentTestBannerProps {
  missingCount: number
  onClick: () => void
}

export function AttachmentTestBanner({ missingCount, onClick }: AttachmentTestBannerProps) {
  return (
    <div
      className="-mx-5 mt-4 h-[68px] cursor-pointer overflow-hidden bg-gray-neutral-100 pl-[28px]"
      onClick={wrapWithTracking(BUTTON_NAMES.GO_ATTACHMENT_TEST, CATEGORIES.MAIN, onClick)}
    >
      <div className="relative flex h-full items-center">
        <img src={noteImage} alt="Note" className="h-[68px] w-[96px] object-contain" />
        {/* 텍스트와 아이콘 */}
        <div className="relative z-10 ml-[12px] flex w-full items-center justify-between pr-8">
          <span className="body3-semibold text-gray-iron-950">
            아직 채우지 않은 성향 카드가 {missingCount}건 있어요!
          </span>

          {/* Chevron 아이콘 */}
          <div className="ml-8 flex h-6 w-6 items-center justify-center rounded-full bg-[#3F3F46]">
            <ChevronRight className="h-[18px] w-[18px] text-white" />
          </div>
        </div>
      </div>
    </div>
  )
}
