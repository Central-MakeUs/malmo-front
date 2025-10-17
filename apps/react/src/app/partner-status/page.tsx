import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { z } from 'zod'

import momoEmptyStateImage from '@/assets/images/momo-empty-state.png'
import { wrapWithTracking } from '@/shared/analytics'
import { BUTTON_NAMES, CATEGORIES } from '@/shared/analytics/constants'
import { Screen } from '@/shared/layout/screen'
import { useGoBack } from '@/shared/navigation/use-go-back'
import { Button } from '@/shared/ui/button'
import { DetailHeaderBar } from '@/shared/ui/header-bar'

// 쿼리 파라미터 검증 스키마
const partnerStatusSearchSchema = z.object({
  type: z.enum(['not-tested', 'not-connected']).catch('not-tested'),
})

export const Route = createFileRoute('/partner-status/')({
  validateSearch: partnerStatusSearchSchema,
  component: PartnerStatusPage,
})

function PartnerStatusPage() {
  const navigate = useNavigate()
  const goBack = useGoBack()
  const { type } = useSearch({ from: '/partner-status/' })

  const handleGoToHome = () => {
    goBack()
  }

  const handleGoToMyPage = wrapWithTracking(BUTTON_NAMES.GO_MYPAGE, CATEGORIES.MAIN, () => navigate({ to: '/my-page' }))

  return (
    <Screen>
      <Screen.Header>
        <DetailHeaderBar onBackClick={handleGoToHome} />
      </Screen.Header>

      <Screen.Content className="no-bounce-scroll flex flex-1 flex-col bg-white pb-[var(--safe-bottom)]">
        <div className="flex flex-1 -translate-y-[80px] flex-col items-center justify-center px-6">
          <div className="h-[236px] w-[320px]">
            <img src={momoEmptyStateImage} className="h-full w-full object-contain" />
          </div>

          {type === 'not-connected' ? (
            <h1 className="heading1-bold mt-6 text-center text-gray-iron-950">아직 커플 연동하기 전이에요!</h1>
          ) : (
            <h1 className="heading1-bold mt-6 text-center text-gray-iron-950">아직 애착유형 검사를 하기 전이에요!</h1>
          )}

          {type === 'not-connected' ? (
            <p className="body2-medium mt-1 text-center">
              <span className="text-malmo-rasberry-500">마이페이지 &gt; 프로필 &gt; 커플 연동 관리</span>
              <span className="text-gray-iron-950">에서 초대가 가능해요</span>
            </p>
          ) : (
            <p className="body2-medium mt-1 text-center text-gray-iron-500">
              연인이 검사를 완료하면 결과를 볼 수 있어요
            </p>
          )}
        </div>

        {type === 'not-connected' ? (
          <div className="mb-5 px-6">
            <Button text="마이페이지로 이동하기" onClick={handleGoToMyPage} />
          </div>
        ) : null}
      </Screen.Content>
    </Screen>
  )
}
