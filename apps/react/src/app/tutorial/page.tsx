import { createFileRoute } from '@tanstack/react-router'

import tutBannerMomo from '@/assets/icons/tut_banner_momo.png'
import tutPhone01 from '@/assets/icons/tut_phone_01.png'
import tutPhone02 from '@/assets/icons/tut_phone_02.png'
import tutPhone03 from '@/assets/icons/tut_phone_03.png'
import { Screen } from '@/shared/layout/screen'
import { DetailHeaderBar } from '@/shared/ui/header-bar'

export const Route = createFileRoute('/tutorial/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Screen>
      <Screen.Header>
        <DetailHeaderBar className="bg-white" />
      </Screen.Header>

      <Screen.Content className="no-bounce-scroll flex-1 bg-white px-5 pb-[calc(var(--safe-bottom)+40px)]">
        <div className="pt-4">
          <h1 className="title2-bold text-gray-iron-950">말모 사용설명서 👀</h1>

          <hr className="mt-5 h-[0.5px] border-0 bg-gray-iron-300" />

          <img src={tutBannerMomo} alt="말모 사용설명서 배너" className="mt-5 h-[204px] w-full object-cover" />

          <p className="body2-reading-regular mt-4 text-gray-iron-900">
            안녕하세요! 오늘은 어떤 고민 때문에 말모를 찾아 오셨나요? 말모가 처음이신 분들을 위해 연애 고민 상담사
            모모가 사용설명서를 준비했어요!
          </p>

          <section className="mt-12">
            <h2 className="heading2-semibold text-gray-iron-950">
              1. 나의 애착유형은 무엇일까? 말모에서 확인해 보세요
            </h2>
            <img src={tutPhone01} alt="애착유형 테스트 안내" className="mt-5 h-[334px] w-full object-contain" />
            <p className="body2-semibold mt-6 text-gray-iron-900">
              🗨️ 회피형, 불안형.. 많이 들어봤는데, 그게 정확히 뭐지!?
            </p>
            <div className="mt-3 text-gray-iron-900">
              <p className="body2-medium">애착유형은 가까운 관계에서 나타나는 감정과 행동 패턴이에요!</p>
              <p className="body2-reading-regular">
                감정적인 갈등은 자꾸만 피하고 싶다거나, 연인의 사소한 행동에도 상처 받는다거나… 우리의 연애 고민에는
                애착유형이 깊숙이 반영되어 있어요. 말모에서 테스트 하고 결과를 바로 확인할 수 있어요!
              </p>
            </div>
          </section>

          <section className="mt-[60px]">
            <h2 className="heading2-semibold text-gray-iron-950">2. 이해되지 않던 속마음을 성향으로 풀어봐요</h2>
            <img src={tutPhone02} alt="상대 성향 이해 안내" className="mt-5 h-[334px] w-full object-contain" />
            <p className="body2-semibold mt-6 text-gray-iron-900">
              🗨️ 서운함을 표현할 때마다 상대가 내 감정을 무시하는 것 같아요…
            </p>
            <div className="mt-3 text-gray-iron-900">
              <p className="body2-medium">모모는 이해하기 어려웠던 상대의 행동을 애착유형으로 해석해 줘요.</p>
              <p className="body2-reading-regular">
                단순히 회피한다고 모두 같은 회피형은 아니에요. 각자만의 회피 성향이 나타나는 지점이 고민 상황에 숨어
                있거든요. 모모와의 대화를 통해 ‘마음이 떠난 게 아니라 오히려 조심스러웠던 거구나’ 하고 이해할 수 있어요.
                자꾸 답답했던 감정도 내가 왜 이렇게 느꼈는지를 차근차근 짚어줘요.
              </p>
            </div>
          </section>

          <section className="mt-[60px]">
            <h2 className="heading2-semibold text-gray-iron-950">3. 성향에 맞춰 현실적인 해결책을 제안해요</h2>
            <img src={tutPhone03} alt="현실적인 해결책 안내" className="mt-5 h-[334px] w-full object-contain" />
            <p className="body2-semibold mt-6 text-gray-iron-900">🗨️ 속마음까진 알았는데, 그래서 어떻게 해야 되지?</p>
            <div className="mt-3 text-gray-iron-900">
              <p className="body2-medium">
                모모는 상대의 성향을 바탕으로 지금 상황에서 해볼 수 있는 행동을 하나씩 알려 줘요!
              </p>
              <p className="body2-reading-regular">
                ‘내 감정을 설명하고 설득하기보다, 내가 바라는 관계의 모습을 말하는 게 좋겠구나!’ 하고 관계를 개선해 나갈
                수 있어요. 나와 상대의 성향을 기준으로 질문하고 답하면서, 풀리지 않던 고민을 풀 수 있어요.
              </p>
            </div>
          </section>

          <p className="body2-semibold mt-12 text-gray-iron-900">이제 말모와 함께 연애 고민을 해결해 볼까요? 💌</p>
        </div>
      </Screen.Content>
    </Screen>
  )
}
