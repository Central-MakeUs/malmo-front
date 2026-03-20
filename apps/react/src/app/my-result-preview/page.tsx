import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { LucideCheck, LucideChevronRight } from 'lucide-react'

import { getAttachmentType } from '@/features/attachment'
import { useAuth } from '@/features/auth'
import { personalityFlowSearchSchema, usePersonalityFlow } from '@/features/profile/lib/personality-flow'
import { Screen } from '@/shared/layout/screen'
import { Button } from '@/shared/ui'
import { FixedBottom } from '@/shared/ui/fixed-bottom'
import { FlowProgressBar } from '@/shared/ui/flow-progress-bar'
import { DetailHeaderBar } from '@/shared/ui/header-bar'

export const Route = createFileRoute('/my-result-preview/')({
  validateSearch: personalityFlowSearchSchema,
  component: MyResultPreviewPage,
})

function MyResultPreviewPage() {
  const navigate = useNavigate()
  const { userInfo } = useAuth()
  const { next } = usePersonalityFlow()

  const attachmentData = getAttachmentType(userInfo.loveTypeCategory)

  const handleViewResult = () => {
    navigate({ to: '/attachment-test/result/my' })
  }

  return (
    <Screen>
      <Screen.Header behavior="overlay">
        <DetailHeaderBar center={<FlowProgressBar step={3} total={5} highlightSteps={[3, 5]} />} />
      </Screen.Header>

      <Screen.Content className="flex flex-1 flex-col bg-white">
        <div className="flex flex-1 flex-col items-center justify-center px-5">
          {/* Checkmark circle */}
          <div
            className="flex h-14 w-14 items-center justify-center rounded-full"
            style={{ background: 'linear-gradient(180deg, rgba(236, 70, 101, 1), rgba(247, 142, 162, 1))' }}
          >
            <LucideCheck className="h-7 w-7 text-white" strokeWidth={2.5} />
          </div>

          <h1 className="title2-bold mt-5 text-center text-gray-iron-950">내 성향 프로필을 완성했어요!</h1>
          <p className="body3-medium mt-1 text-center text-gray-iron-500">연인의 프로필도 완성하러 가볼까요?</p>

          {/* Result card */}
          {attachmentData && (
            <div className="mt-[60px] w-full rounded-2xl border border-gray-neutral-200 px-[22px] py-6">
              <p className="heading2-bold text-malmo-orange-500">{userInfo.nickname}님은</p>
              <h2 className="title1-bold mt-2 text-gray-iron-950">
                {userInfo.personalityType} {attachmentData.subtype}
              </h2>
              <p className="body3-medium mt-1 line-clamp-2 text-gray-iron-500">{attachmentData.description}</p>
              <button
                onClick={handleViewResult}
                className="body3-medium mt-8 flex items-center gap-1 rounded-[8px] bg-gray-neutral-200 px-[18px] py-2 text-gray-iron-800"
              >
                내 결과 보러가기
                <LucideChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        <FixedBottom className="mt-0">
          <Button text="계속하기" onClick={next} />
        </FixedBottom>
      </Screen.Content>
    </Screen>
  )
}
