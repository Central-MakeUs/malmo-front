import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { LucideCheck, LucideChevronRight } from 'lucide-react'

import { getAttachmentType } from '@/features/attachment'
import { useAuth } from '@/features/auth'
import { personalityFlowSearchSchema } from '@/features/profile/lib/personality-flow'
import { Screen } from '@/shared/layout/screen'
import chatService from '@/shared/services/chat.service'
import { Button } from '@/shared/ui'
import { FixedBottom } from '@/shared/ui/fixed-bottom'
import { FlowProgressBar } from '@/shared/ui/flow-progress-bar'
import { DetailHeaderBar } from '@/shared/ui/header-bar'

export const Route = createFileRoute('/partner-result-preview/')({
  validateSearch: personalityFlowSearchSchema,
  component: PartnerResultPreviewPage,
})

function PartnerResultPreviewPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { userInfo } = useAuth()
  const { mutateAsync: createChatRoom, isPending } = useMutation(chatService.createChatRoomMutation())

  const attachmentData = userInfo.partnerLoveTypeCategory ? getAttachmentType(userInfo.partnerLoveTypeCategory) : null

  const handleViewResult = () => {
    navigate({ to: '/attachment-test/result/partner', search: { from: 'partner-result-preview' }, replace: true })
  }

  const handleStartChat = async () => {
    if (isPending) return

    const created = await createChatRoom()
    const createdId = created?.chatRoomId
    if (createdId) {
      queryClient.setQueryData(chatService.chatRoomStatusQuery().queryKey, {
        chatRoomId: createdId,
        createdAt: new Date().toISOString(),
      })
    }

    navigate({ to: '/chat', replace: true })
  }

  return (
    <Screen>
      <Screen.Header behavior="overlay">
        <DetailHeaderBar center={<FlowProgressBar step={5} total={5} highlightSteps={[3, 5]} />} />
      </Screen.Header>

      <Screen.Content className="flex flex-1 flex-col bg-white">
        <div className="flex flex-1 flex-col items-center justify-center px-5">
          {/* Checkmark circle */}
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full"
            style={{ background: 'linear-gradient(180deg, rgba(236, 70, 101, 1), rgba(247, 142, 162, 1))' }}
          >
            <LucideCheck className="h-6 w-6 text-white" strokeWidth={2.5} />
          </div>

          <h1 className="heading1-bold mt-5 text-center text-gray-iron-950">상대의 프로필까지 모두 완성했어요!</h1>
          <p className="body2-medium mt-1 text-center text-gray-iron-500">이제 상담하러 가볼까요?</p>

          {/* Result card */}
          {attachmentData && (
            <div className="mt-[60px] w-full rounded-2xl border border-gray-neutral-200 px-[22px] py-6">
              <p className="heading2-bold text-malmo-orange-500">상대는</p>
              <h2 className="title1-bold mt-2 text-gray-iron-950">
                {userInfo.otherPersonalityType} {attachmentData.subtype}
              </h2>
              <p className="body3-medium mt-1 line-clamp-2 text-gray-iron-500">{attachmentData.previewDescription}</p>
              <button
                onClick={handleViewResult}
                className="body3-medium mt-8 flex items-center gap-1 rounded-[8px] bg-gray-neutral-200 px-[18px] py-2 text-gray-iron-800"
              >
                상대방 결과 보러가기
                <LucideChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        <FixedBottom className="mt-0 flex flex-col gap-3">
          <Button text="상담하러 가기" onClick={handleStartChat} disabled={isPending} />
          <Button text="돌아가기" type="ghost" onClick={() => navigate({ to: '/', replace: true })} />
        </FixedBottom>
      </Screen.Content>
    </Screen>
  )
}
