import StableImage from '@/assets/images/characters/stable.png'
import AnxietyImage from '@/assets/images/characters/anxiety.png'
import AvoidanceImage from '@/assets/images/characters/avoidance.png'
import ConfusionImage from '@/assets/images/characters/confusion.png'
// 홈페이지 카드용 캐릭터 이미지
import StableCardImage from '@/assets/images/characters/stable-card.png'
import AnxietyCardImage from '@/assets/images/characters/anxiety-card.png'
import AvoidanceCardImage from '@/assets/images/characters/avoidance-card.png'
import ConfusionCardImage from '@/assets/images/characters/confusion-card.png'
import { AttachmentType, type AttachmentTypeData } from './types'

// 안정형 (평온이)
export const STABLE_TYPE_DATA: AttachmentTypeData = {
  type: AttachmentType.STABLE,
  character: '평온이',
  subtype: '안정형',
  characterImage: StableImage,
  cardImage: StableCardImage,
  color: '#EC4665',
  badgeBackgroundColor: 'bg-malmo-rasberry-25',
  badgeTextColor: 'text-malmo-rasberry-500',
  anxietyThreshold: '2.33 미만',
  avoidanceThreshold: '2.66 미만',
  description: `평온이 성격을 가진 사람은 연인과 가까워질 때 안정감을 느껴요. 연애 중에도 나만의 삶과 영역을 균형 있게 유지하는 편이에요.

연인이 고민을 털어놓을 때는 든든하게 곁을 지켜주고, 갈등이 생겨도 감정에 솔직하면서 차분히 대화로 해결하려는 태도를 보여요.

진지한 관계를 지향하며, 상대를 존중하며 성숙하게 사랑해요. 평온이 성격을 가진 사람은 연인과 주로 안정적이고 친밀한 관계를 만들어 가는 경우가 많아요!`,
  relationshipAttitudes: [
    '관계를 맺을 때 연인이 믿을 만한 사람이라고 생각하며, 서로 신뢰하는 관계를 쌓아요.',
    '연인에게 의지하거나, 연인이 내게 의지할 때 편안함을 느껴요.',
    '연인이 힘들 때 옆에서 도움을 주려고 노력해요.',
    '스스로 버림받을까 걱정하지 않고, 사랑받을 가치가 있다고 믿어요.',
    '과도한 집착이나 거리두기 없이 상황과 상대를 고려해 관계를 유지해요.',
  ],
  conflictSolvingAttitudes: [
    '갈등이 생겨도 내 감정에만 휘둘리기보다 연인의 감정을 이해하고 문제를 해결하려는 태도를 보여요.',
    '연인이 내게 실수를 하더라도 그럴 만한 사정이 있을 것이라고 믿어요.',
    '연인의 특성을 받아들이고, "어떻게 하면 연인과 더 잘 지낼 수 있을까"를 고민해요.',
  ],
  emotionalExpressions: [
    '애정 표현에 인색하지 않고, 감정 기복이 작아요.',
    '연인과 밀당하기보다는 내 감정을 솔직하게 표현해서 신뢰감을 주어요.',
    '연인의 판단이나 거부에 대한 두려움 없이 내 생각을 편안하게 공유해요.',
  ],
}

// 불안형 (걱정이)
export const ANXIETY_TYPE_DATA: AttachmentTypeData = {
  type: AttachmentType.ANXIETY,
  character: '걱정이',
  subtype: '불안형',
  characterImage: AnxietyImage,
  cardImage: AnxietyCardImage,
  color: '#FF8400',
  badgeBackgroundColor: 'bg-malmo-orange-50',
  badgeTextColor: 'text-malmo-orange-500',
  anxietyThreshold: '2.33 이상',
  avoidanceThreshold: '2.61 미만',
  description: `걱정이 성격을 가진 사람은 상대의 반응에 쉽게 불안해져요. '사랑받고 있는 게 맞을까?'라는 의심이 자주 들고, 끊임없이 애정을 확인받고 싶어 해요.

자신의 속마음은 잘 이야기하지만, 동시에 정서적 의존도도 높은 편이에요. 상대의 작은 필요에 과도하게 맞춰주며 애정을 얻으려 할 때가 있어요.

하지만 그러다보면 마음의 균형을 잃고, 연애가 힘들어질 수 있어요. 사랑을 원하는 마음 자체는 소중하지만, 내 감정도 함께 돌보는 것도 중요해요!`,
  relationshipAttitudes: [
    '사랑에 몰입하고, 감정적으로 밀착된 관계를 원해요.',
    '연인이 내가 준 애정만큼 애정을 주지 않을 까봐 불안해요.',
    '나의 단점을 알게 되면 상대가 떠나갈 것이라 생각해요.',
    '혼자 있는 시간엔 관계에 대해 자주 걱정하고 의심해요.',
    '때로는 "이 사람 없으면 아무도 못 만나"라는 부정적인 생각이 들 때도 있어요.',
  ],
  conflictSolvingAttitudes: [
    '갈등이 생겼을 때, 연인이 꾸준히 표현하고 확신을 주길 원해요.',
    '갈등이 생기면 쌓아 두었다가 감정적으로 폭발하거나 자신을 탓하는 경우가 많아요.',
    '연인의 작은 요구나 불평에도 과도하게 자신을 희생하는 경향이 있어요.',
  ],
  emotionalExpressions: [
    '정서적인 표현과 교류를 잘할 수 있어요.',
    '그만큼 힘들 때 연인에게 정서적으로 의존하고 싶어 해요.',
    '애정에 민감하고, 연인의 작은 말에도 쉽게 흔들려요.',
  ],
}

// 회피형 (도망이)
export const AVOIDANCE_TYPE_DATA: AttachmentTypeData = {
  type: AttachmentType.AVOIDANCE,
  character: '도망이',
  subtype: '회피형',
  characterImage: AvoidanceImage,
  cardImage: AvoidanceCardImage,
  color: '#EC4665',
  badgeBackgroundColor: 'bg-malmo-rasberry-25',
  badgeTextColor: 'text-malmo-rasberry-500',
  anxietyThreshold: '2.33 미만',
  avoidanceThreshold: '2.61 이상',
  description: `도망이 성격을 가진 사람은 혼자만의 시간과 독립성을 무엇보다 중요하게 여겨요. 그래서 연애보다는 일이나 취미에서 더 큰 만족을 느끼는 경우도 많아요.

나를 드러내거나 감정을 솔직하게 표현하는 게 익숙하지 않다 보니, 연인이 감정적으로 다가올 때 어떻게 받아줘야 할지 몰라서 부담을 느끼기도 해요. 그래서 자연스럽게 공감보다는 해결 중심의 대화를 하게 되는 편이에요.

운명 같은 완벽한 사랑을 꿈꾸지만, 가까운 현실적인 사랑에는 서툴 수 있어요. 지금 중요한 건, 누군가에게 기대는 일이 약한 게 아니라는 걸 아는 거예요!`,
  relationshipAttitudes: [
    '관계로부터 상처 받지 않기 위해, 가까워질수록 거리감을 두려는 경향이 있어요.',
    '혼자만의 시간과 공간이 확보될 때 편안함을 느끼고, 내 영역이 침범당하면 경계심을 느껴요.',
    '중요한 고민이나 결정을 연인과 의논하기보다 혼자 결정하는 편이에요.',
    '나를 향한 비판을 방어적으로 반응해서, 관계에 생긴 불만의 원인을 연인에게서 먼저 찾는 편이에요.',
    '관계에 대한 이상은 크지만, 현실적인 친밀감에는 부담을 느끼기도 해요.',
  ],
  conflictSolvingAttitudes: [
    '갈등이 생기면 대화를 회피하거나 혼자 정리하는 방식으로 반응해요.',
    '연인이 힘든 일을 이야기하면, 정서적으로 풀기보다 해결책 중심으로 말하려는 경향이 있어요.',
    '충돌 자체를 피하고 싶어 "상처받느니 차라리 멀어지자"는 생각을 할 때도 있어요.',
  ],
  emotionalExpressions: [
    '감정을 표현하는 데 익숙하지 않고, 나를 잘 드러내지 않아요.',
    '애정을 느끼더라도 표현이 부족해 무관심하거나 차갑게 보일 수 있어요.',
    '정서적으로 기대는 걸 약하다고 느끼거나 불편해서, 감정적인 의존을 꺼리는 편이에요.',
  ],
}

// 혼란형 (갈팡이)
export const CONFUSION_TYPE_DATA: AttachmentTypeData = {
  type: AttachmentType.CONFUSION,
  character: '갈팡이',
  subtype: '혼란형',
  characterImage: ConfusionImage,
  cardImage: ConfusionCardImage,
  color: '#FF8400',
  badgeBackgroundColor: 'bg-malmo-orange-50',
  badgeTextColor: 'text-malmo-orange-500',
  anxietyThreshold: '2.33 이상',
  avoidanceThreshold: '2.61 이상',
  description: `갈팡이 성격을 가진 사람은 "사랑받고 싶다"는 마음과 "상처받을까봐 두렵다"는 마음이 자주 충돌해요. 그래서 연인에게 강하게 끌리다가도, 갑자기 밀어내거나 비판하는 모습을 보일 수 있어요.

나를 온전히 드러내면 떠날까 봐 두려워, 마음을 숨기기도 해요. 스스로도 연인도 믿기 어려워서 관계를 유지하는 것이 어렵게 느껴질 수 있어요.

감정의 소용돌이는 크지만, 그만큼 감정도 깊어요. 갈팡질팡하는 내 마음을 비난하기보다, 이해하려고 하면 더 안정적인 관계로 이어질 수 있어요!`,
  relationshipAttitudes: [
    '혼자일 때는 안정감을 원하면서도, 너무 가까워지면 불편함이나 압박감을 느껴요.',
    '가까운 관계를 바라면서도 거절에 대한 두려움으로 거리감을 종종 둬요.',
    '관계가 안정적이어도 언제든 무너질 수 있다는 불안을 느끼며, 종종 사이가 틀어질 것 같은 기분을 느껴요.',
    '그래서 연인을 믿고 싶지만, 확신이 잘 들지 않을 때도 있어요.',
    '연인에게 과도하게 집중하며 큰 감정 기복이 나타날 수 있어요.',
  ],
  conflictSolvingAttitudes: [
    '갈등이 생기면 감정이 격해지거나 완전히 회피해요.',
    '갈등 상황에서 대화보다는 연인에게 집착하거나, 반대로 관계를 끊어버릴 수 있어요.',
    '충돌 상황에서 나도 상대도 믿지 못하면서, 더 큰 거리감을 만들 수 있어요.',
  ],
  emotionalExpressions: [
    '내 감정을 솔직하게 전하고 싶지만, 스스로 어떤 감정을 느끼는지 정리하기 어려워요.',
    '감정이 안정되지 않고 애정 표현이 비일관적이어서 연인에게 혼란을 줄 수 있어요.',
    '사랑받기 위해 연인을 과하게 의식하거나, 감정을 숨기는 경우도 있어요.',
  ],
}
