import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { LucideCheck, LucideChevronRight } from 'lucide-react'

import { getAttachmentType } from '@/features/attachment'
import { useAuth } from '@/features/auth'
import { personalityFlowSearchSchema } from '@/features/profile/lib/personality-flow'
import { Screen } from '@/shared/layout/screen'
import { Button } from '@/shared/ui'
import { FlowProgressBar } from '@/shared/ui/flow-progress-bar'
import { DetailHeaderBar } from '@/shared/ui/header-bar'

export const Route = createFileRoute('/my-result-preview/')({
  validateSearch: personalityFlowSearchSchema,
  component: MyResultPreviewPage,
})

function MyResultPreviewPage() {
  const navigate = useNavigate()
  const { flow, chatId } = useSearch({ from: Route.id })
  const { userInfo } = useAuth()

  const attachmentData = getAttachmentType(userInfo.loveTypeCategory)

  const handleContinue = () => {
    if (flow !== 'chat-entry') {
      navigate({ to: '/', replace: true })
      return
    }
    navigate({ to: '/partner-mbti', search: { flow, chatId } })
  }

  const handleViewResult = () => {
    navigate({ to: '/attachment-test/result/my' })
  }

  return (
    <Screen>
      <Screen.Header behavior="overlay">
        <DetailHeaderBar
          center={flow === 'chat-entry' ? <FlowProgressBar step={3} total={5} highlightSteps={[3, 5]} /> : undefined}
        />
      </Screen.Header>

      <Screen.Content className="flex flex-1 flex-col bg-white">
        <div className="flex flex-1 flex-col items-center justify-center px-5">
          {/* Checkmark circle */}
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-malmo-rasberry-500">
            <LucideCheck className="h-7 w-7 text-white" strokeWidth={2.5} />
          </div>

          <h1 className="title2-bold mt-4 text-center text-gray-iron-950">내 성향 프로필을 완성했어요!</h1>
          <p className="body3-medium mt-2 text-center text-gray-iron-500">연인의 프로필도 완성하러 가볼까요?</p>

          {/* Result card */}
          {attachmentData && (
            <div className="mt-8 w-full rounded-2xl border border-gray-neutral-200 p-5">
              <p className="body3-medium text-malmo-orange-500">{userInfo.nickname}님은</p>
              <h2 className="title2-bold mt-1 text-gray-iron-950">
                {userInfo.personalityType} {attachmentData.subtype}
              </h2>
              <p className="body3-medium mt-3 line-clamp-2 text-gray-iron-500">{attachmentData.description}</p>
              <button
                onClick={handleViewResult}
                className="body3-medium mt-5 flex items-center gap-1 rounded-lg bg-gray-neutral-100 px-4 py-2 text-gray-iron-700"
              >
                내 결과 보러가기
                <LucideChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        <div className="mb-5 px-5 pb-[var(--safe-bottom)]">
          <Button text={flow === 'chat-entry' ? '프로필 이어서 완성하기' : '홈으로 가기'} onClick={handleContinue} />
        </div>
      </Screen.Content>
    </Screen>
  )
}
