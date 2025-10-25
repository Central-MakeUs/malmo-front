import { STABLE_TYPE_DATA, ANXIETY_TYPE_DATA, AVOIDANCE_TYPE_DATA, CONFUSION_TYPE_DATA } from './attachment-types'
import { AttachmentType } from './types'

// 애착유형 검사 정보 데이터
export const ATTACHMENT_TEST_INFO = [
  '애착유형은 친밀한 관계에서의 감정과 행동 패턴을 설명해요.',
  '안정형, 회피형, 불안형, 혼란형까지 총 4가지 유형이 있어요.',
  '심리학 이론과 연구에 기반해 연애 관계를 이해하는 데 도움을 주어요.',
  'MBTI처럼 단순한 성격 분류가 아닌, 실제 관계 개선에 활용되는 도구예요.',
]

// 애착유형 캐릭터 미리보기 데이터
export const ATTACHMENT_TYPE_PREVIEW = [
  {
    name: STABLE_TYPE_DATA.character,
    description: `연인을 신뢰하고, 감정을 잘 표현하는 ${STABLE_TYPE_DATA.subtype}`,
    bgColor: 'bg-malmo-rasberry-25',
    textColor: 'text-malmo-rasberry-500',
  },
  {
    name: ANXIETY_TYPE_DATA.character,
    description: `연인과 멀어질까봐 자주 걱정하는 ${ANXIETY_TYPE_DATA.subtype}`,
    bgColor: 'bg-malmo-orange-50',
    textColor: 'text-malmo-orange-500',
  },
  {
    name: AVOIDANCE_TYPE_DATA.character,
    description: `연인과 가까워질수록 거리가 필요한 ${AVOIDANCE_TYPE_DATA.subtype}`,
    bgColor: 'bg-malmo-rasberry-25',
    textColor: 'text-malmo-rasberry-500',
  },
  {
    name: CONFUSION_TYPE_DATA.character,
    description: `연인과 가까워지고 싶지만 거리를 두는 ${CONFUSION_TYPE_DATA.subtype}`,
    bgColor: 'bg-malmo-orange-50',
    textColor: 'text-malmo-orange-500',
  },
]

// 애착유형별 상세 데이터 매핑
export const ATTACHMENT_TYPE_DATA = {
  [AttachmentType.STABLE]: STABLE_TYPE_DATA,
  [AttachmentType.ANXIETY]: ANXIETY_TYPE_DATA,
  [AttachmentType.AVOIDANCE]: AVOIDANCE_TYPE_DATA,
  [AttachmentType.CONFUSION]: CONFUSION_TYPE_DATA,
}
