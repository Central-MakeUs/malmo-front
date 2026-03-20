import { ChevronRight } from 'lucide-react'
import { useState } from 'react'

import MyMysteryMomo from '@/assets/icons/my-mystery.svg'
import PartnerMysteryMomo from '@/assets/icons/partner-mystery.svg'
import type { LoveTypeCatalogItem } from '@/features/attachment/models/love-type-catalog'
import { Badge } from '@/shared/ui'

interface AttachmentTypeCardsProps {
  myAttachmentData: LoveTypeCatalogItem | null
  partnerAttachmentData: LoveTypeCatalogItem | null
  myAttachmentType: string | undefined
  partnerAttachmentType: string | undefined
  isPartnerUnknown?: boolean
  onMyCardClick: () => void
  onPartnerCardClick: () => void
}

export function AttachmentTypeCards({
  myAttachmentData,
  partnerAttachmentData,
  myAttachmentType,
  partnerAttachmentType,
  isPartnerUnknown = false,
  onMyCardClick,
  onPartnerCardClick,
}: AttachmentTypeCardsProps) {
  const [showTooltip, setShowTooltip] = useState(true)

  const handlePartnerCardClick = () => {
    if (showTooltip && isPartnerUnknown) {
      setShowTooltip(false)
    }
    onPartnerCardClick()
  }

  const getPartnerBadgeText = () => {
    if (partnerAttachmentType) return partnerAttachmentType
    if (isPartnerUnknown) return 'AI 분석 예정'
    return '입력 필요'
  }

  const getPartnerBadgeVariant = (): 'default' | 'required' | 'rasberry' => {
    if (partnerAttachmentData) return 'default'
    if (isPartnerUnknown) return 'rasberry'
    return 'required'
  }

  const cards = [
    {
      title: '나의 성향',
      attachmentData: myAttachmentData,
      attachmentType: myAttachmentType,
      badgeText: myAttachmentType || '입력 필요',
      badgeVariant: myAttachmentData ? ('default' as const) : ('required' as const),
      mysteryIcon: MyMysteryMomo,
      onClick: onMyCardClick,
    },
    {
      title: '상대의 성향',
      attachmentData: partnerAttachmentData,
      attachmentType: partnerAttachmentType,
      badgeText: getPartnerBadgeText(),
      badgeVariant: getPartnerBadgeVariant(),
      mysteryIcon: PartnerMysteryMomo,
      onClick: handlePartnerCardClick,
    },
  ]

  return (
    <div className="-mx-5 mt-9 bg-gray-neutral-100 px-5 pt-8 pb-8">
      <h2 className="heading2-semibold text-gray-iron-950">연애 성향 카드</h2>

      <div className="mt-3 flex gap-[10px]">
        {cards.map((card) => (
          <div key={card.title} className="flex-1" onClick={card.onClick}>
            <div className="h-[170px] cursor-pointer overflow-hidden rounded-[10px] bg-white">
              {/* 카드 헤더 */}
              <div className="flex h-10 items-center justify-between bg-gray-iron-700 pr-[10px] pl-4">
                <span className="body3-medium text-white">{card.title}</span>
                <ChevronRight className="h-5 w-5 text-white" />
              </div>

              {/* 카드 내용 */}
              <div className="relative h-[130px] p-[12px]">
                <Badge
                  variant={card.badgeVariant}
                  className={
                    card.attachmentData
                      ? `${card.attachmentData.badgeBackgroundColor} ${card.attachmentData.badgeTextColor}`
                      : ''
                  }
                >
                  {card.badgeText}
                </Badge>

                <div className="absolute right-0 bottom-0">
                  {card.attachmentData?.cardImage ? (
                    <img
                      src={card.attachmentData.cardImage}
                      alt={card.attachmentType || ''}
                      className="h-20 w-[84px] object-contain"
                    />
                  ) : (
                    <card.mysteryIcon className="h-20 w-[84px]" />
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isPartnerUnknown && showTooltip && (
        <div className="mt-3 rounded-[10px] bg-gray-iron-700 px-4 py-3">
          <p className="body3-medium text-white">AI가 대화 중 상대의 성향을 분석할 예정이에요</p>
        </div>
      )}
    </div>
  )
}
