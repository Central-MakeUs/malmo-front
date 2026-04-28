import { MemberDataLoveTypeCategoryEnum } from '@data/user-api-axios/api'

import AnxietyResultImage from '@/assets/images/attachment-result/attachment-result-anxiety.png'
import AvoidanceResultImage from '@/assets/images/attachment-result/attachment-result-avoidance.png'
import ConfusionResultImage from '@/assets/images/attachment-result/attachment-result-confusion.png'
import StableResultImage from '@/assets/images/attachment-result/attachment-result-stable.png'
import AnxietyCardImage from '@/assets/images/characters/anxiety-card.png'
import AvoidanceCardImage from '@/assets/images/characters/avoidance-card.png'
import ConfusionCardImage from '@/assets/images/characters/confusion-card.png'
import StableCardImage from '@/assets/images/characters/stable-card.png'

export type LoveTypeCategory = MemberDataLoveTypeCategoryEnum

export interface LoveTypeCatalogItem {
  character: string
  subtype: string
  previewDescription: string
  cardImage: string
  resultImage: string
  badgeBackgroundColor: string
  badgeTextColor: string
  isWarmType: boolean
}

export interface AttachmentTypePreviewItem {
  name: string
  description: string
  bgColor: string
  textColor: string
}

export const LOVE_TYPE_CATALOG: Record<LoveTypeCategory, LoveTypeCatalogItem> = {
  [MemberDataLoveTypeCategoryEnum.StableType]: {
    character: '평온이',
    subtype: '안정형',
    previewDescription: '연인을 신뢰하고, 감정을 잘 표현하는 안정형',
    cardImage: StableCardImage,
    resultImage: StableResultImage,
    badgeBackgroundColor: 'bg-malmo-rasberry-25',
    badgeTextColor: 'text-malmo-rasberry-500',
    isWarmType: false,
  },
  [MemberDataLoveTypeCategoryEnum.AnxietyType]: {
    character: '걱정이',
    subtype: '불안형',
    previewDescription: '연인과 멀어질까봐 자주 걱정하는 불안형',
    cardImage: AnxietyCardImage,
    resultImage: AnxietyResultImage,
    badgeBackgroundColor: 'bg-malmo-orange-50',
    badgeTextColor: 'text-malmo-orange-500',
    isWarmType: true,
  },
  [MemberDataLoveTypeCategoryEnum.AvoidanceType]: {
    character: '도망이',
    subtype: '회피형',
    previewDescription: '연인과 가까워질수록 거리가 필요한 회피형',
    cardImage: AvoidanceCardImage,
    resultImage: AvoidanceResultImage,
    badgeBackgroundColor: 'bg-malmo-rasberry-25',
    badgeTextColor: 'text-malmo-rasberry-500',
    isWarmType: false,
  },
  [MemberDataLoveTypeCategoryEnum.ConfusionType]: {
    character: '갈팡이',
    subtype: '혼란형',
    previewDescription: '연인과 가까워지고 싶지만 거리를 두는 혼란형',
    cardImage: ConfusionCardImage,
    resultImage: ConfusionResultImage,
    badgeBackgroundColor: 'bg-malmo-orange-50',
    badgeTextColor: 'text-malmo-orange-500',
    isWarmType: true,
  },
}

const LOVE_TYPE_PREVIEW_ORDER: readonly LoveTypeCategory[] = [
  MemberDataLoveTypeCategoryEnum.StableType,
  MemberDataLoveTypeCategoryEnum.AnxietyType,
  MemberDataLoveTypeCategoryEnum.AvoidanceType,
  MemberDataLoveTypeCategoryEnum.ConfusionType,
]

function isLoveTypeCategory(value: string): value is LoveTypeCategory {
  return value in LOVE_TYPE_CATALOG
}

export function getLoveTypeCatalogItem(loveTypeCategory: string | undefined): LoveTypeCatalogItem | null {
  if (!loveTypeCategory || !isLoveTypeCategory(loveTypeCategory)) return null
  return LOVE_TYPE_CATALOG[loveTypeCategory]
}

export const ATTACHMENT_TEST_INFO: readonly string[] = [
  '애착유형은 친밀한 관계에서의 감정과 행동 패턴을 설명해요.',
  '안정형, 회피형, 불안형, 혼란형까지 총 4가지 유형이 있어요.',
  '심리학 이론과 연구에 기반해 연애 관계를 이해하는 데 도움을 주어요.',
  'MBTI처럼 단순한 성격 분류가 아닌, 실제 관계 개선에 활용되는 도구예요.',
]

export const ATTACHMENT_TYPE_PREVIEW: AttachmentTypePreviewItem[] = LOVE_TYPE_PREVIEW_ORDER.map((category) => {
  const item = LOVE_TYPE_CATALOG[category]

  return {
    name: item.character,
    description: item.previewDescription,
    bgColor: item.badgeBackgroundColor,
    textColor: item.badgeTextColor,
  }
})
