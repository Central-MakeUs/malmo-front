import { Link } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'

import MyMysteryMomo from '@/assets/icons/my-mystery.svg'
import PartnerMysteryMomo from '@/assets/icons/partner-mystery.svg'
import { Badge } from '@/shared/ui'

import type { AttachmentTypeData } from '../models/types'

interface AttachmentTypeCardsProps {
  myAttachmentData: AttachmentTypeData | null
  partnerAttachmentData: AttachmentTypeData | null
  myAttachmentType: string | undefined
  partnerAttachmentType: string | undefined
  isPartnerConnected: boolean
}

export function AttachmentTypeCards({
  myAttachmentData,
  partnerAttachmentData,
  myAttachmentType,
  partnerAttachmentType,
  isPartnerConnected,
}: AttachmentTypeCardsProps) {
  const cards = [
    {
      title: '나의 애착유형',
      attachmentData: myAttachmentData,
      attachmentType: myAttachmentType,
      badgeText: myAttachmentType || '검사필요',
      mysteryIcon: MyMysteryMomo,
      navigationTo: myAttachmentData ? '/attachment-test/result/my' : '/attachment-test',
    },
    {
      title: '연인의 애착유형',
      attachmentData: partnerAttachmentData,
      attachmentType: partnerAttachmentType,
      badgeText: partnerAttachmentType || (!isPartnerConnected ? '연동 필요' : '검사 필요'),
      mysteryIcon: PartnerMysteryMomo,
      navigationTo: partnerAttachmentData
        ? '/attachment-test/result/partner'
        : !isPartnerConnected
          ? '/partner-status?type=not-connected'
          : '/partner-status?type=not-tested',
    },
  ]

  return (
    <div className="-mx-5 mt-9 h-[290px] bg-gray-neutral-100 px-5 pt-8">
      <h2 className="heading2-semibold text-gray-iron-950">애착유형 카드</h2>

      {/* 카드 컨테이너 */}
      <div className="mt-3 flex gap-[10px]">
        {cards.map((card) => {
          const CardContent = (
            <div className="h-[170px] cursor-pointer overflow-hidden rounded-[10px] bg-white">
              {/* 카드 헤더 */}
              <div className="flex h-10 items-center justify-between bg-gray-iron-700 pr-[10px] pl-4">
                <span className="body3-medium text-white">{card.title}</span>
                <ChevronRight className="h-5 w-5 text-white" />
              </div>

              {/* 카드 내용 */}
              <div className="relative h-[130px] p-[12px]">
                {/* 상태 뱃지 */}
                <Badge
                  variant={card.attachmentData ? 'default' : 'required'}
                  className={
                    card.attachmentData
                      ? `${card.attachmentData.badgeBackgroundColor} ${card.attachmentData.badgeTextColor}`
                      : ''
                  }
                >
                  {card.badgeText}
                </Badge>

                {/* 애착유형 캐릭터 이미지 */}
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
          )

          return (
            <div key={card.title} className="flex-1">
              <Link to={card.navigationTo}>{CardContent}</Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}
