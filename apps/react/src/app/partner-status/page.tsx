import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { z } from 'zod'

import momoEmptyStateImage from '@/assets/images/momo-empty-state.png'
import { wrapWithTracking } from '@/shared/analytics'
import { BUTTON_NAMES, CATEGORIES } from '@/shared/analytics/constants'
import { Button } from '@/shared/ui/button'
// 상태별 이미지 import
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
  const { type } = useSearch({ from: '/partner-status/' })

  const handleGoToHome = () => {
    navigate({ to: '/' })
  }

  const handleGoToMyPage = wrapWithTracking(BUTTON_NAMES.GO_MYPAGE, CATEGORIES.MAIN, () => navigate({ to: '/my-page' }))

  return (
    <div className="flex h-full w-full flex-col bg-white pb-[var(--safe-bottom)]">
      {/* 헤더 */}
      <DetailHeaderBar onBackClick={handleGoToHome} />

      {/* 메인 콘텐츠 */}
      <div className="flex flex-1 -translate-y-[80px] flex-col items-center justify-center px-6">
        {/* 이미지 */}
        <div className="h-[236px] w-[320px]">
          <img src={momoEmptyStateImage} className="h-full w-full object-contain" />
        </div>

        {/* 타이틀 */}
        {type === 'not-connected' ? (
          <h1 className="heading1-bold mt-6 text-center text-gray-iron-950">아직 커플 연동하기 전이에요!</h1>
        ) : (
          <h1 className="heading1-bold mt-6 text-center text-gray-iron-950">아직 애착유형 검사를 하기 전이에요!</h1>
        )}

        {/* 설명 */}
        {type === 'not-connected' ? (
          <p className="body2-medium mt-1 text-center">
            <span className="text-gray-iron-500">연동하지 않아도 애착유형을 추측해 상담할게요</span>
          </p>
        ) : (
          <p className="body2-medium mt-1 text-center text-gray-iron-500">연인이 검사를 완료하면 결과를 볼 수 있어요</p>
        )}
      </div>

      {/* 하단 버튼 */}
      {type === 'not-connected' && (
        <div className="mb-5 px-6">
          <Button text="마이페이지로 이동하기" onClick={handleGoToMyPage} />
        </div>
      )}
    </div>
  )
}
