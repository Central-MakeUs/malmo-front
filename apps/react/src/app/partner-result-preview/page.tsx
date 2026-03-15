import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'

import { personalityFlowSearchSchema } from '@/features/profile/lib/personality-flow'
import { Screen } from '@/shared/layout/screen'
import { Button } from '@/shared/ui'
import { FlowProgressBar } from '@/shared/ui/flow-progress-bar'
import { DetailHeaderBar } from '@/shared/ui/header-bar'

export const Route = createFileRoute('/partner-result-preview/')({
  validateSearch: personalityFlowSearchSchema,
  component: PartnerResultPreviewPage,
})

function PartnerResultPreviewPage() {
  const navigate = useNavigate()
  const { chatId } = useSearch({ from: Route.id })

  const handleContinue = () => {
    navigate({ to: '/chat', search: { chatId }, replace: true })
  }

  const handleViewResult = () => {
    navigate({
      to: '/attachment-test/result/partner',
    })
  }

  return (
    <Screen>
      <Screen.Header behavior="overlay">
        <DetailHeaderBar center={<FlowProgressBar step={5} total={5} highlightSteps={[3, 5]} />} />
      </Screen.Header>

      <Screen.Content className="flex flex-1 flex-col bg-white">
        <div className="flex flex-1 flex-col items-center justify-center px-5 text-center">
          <h1 className="title2-bold text-gray-iron-950">
            상대방의 성향
            <br />
            결과가 준비됐어요!
          </h1>
          <p className="body3-medium mt-3 text-gray-iron-500">결과지를 확인하거나 상담을 계속 진행해 보세요</p>
        </div>

        <div className="mb-5 flex flex-col gap-3 px-5 pb-[var(--safe-bottom)]">
          <Button text="결과지 보기" type="secondary" onClick={handleViewResult} />
          <Button text="홈으로 가기" onClick={handleContinue} />
        </div>
      </Screen.Content>
    </Screen>
  )
}
