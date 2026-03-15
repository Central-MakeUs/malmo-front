import { useMutation } from '@tanstack/react-query'
import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'

import { ATTACHMENT_OPTIONS } from '@/features/attachment'
import { useAuth } from '@/features/auth'
import { TitleSection } from '@/features/onboarding/ui/title-section'
import { personalityFlowSearchSchema } from '@/features/profile/lib/personality-flow'
import { Screen } from '@/shared/layout/screen'
import { cn } from '@/shared/lib/cn'
import memberService from '@/shared/services/member.service'
import { Button } from '@/shared/ui'
import { getChatEntryProgressBar } from '@/shared/ui/flow-progress-bar'
import { getPersonalityStepDots } from '@/shared/ui/flow-step-dots'
import { DetailHeaderBar } from '@/shared/ui/header-bar'
import { toast } from '@/shared/ui/toast'

import type { MemberDataLoveTypeCategoryEnum } from '@data/user-api-axios/api'

export const Route = createFileRoute('/my-attachment-select/')({
  validateSearch: personalityFlowSearchSchema,
  component: MyAttachmentSelectPage,
})

function MyAttachmentSelectPage() {
  const navigate = useNavigate()
  const { flow, chatId } = useSearch({ from: Route.id })
  const { refreshUserInfo } = useAuth()

  const updateMutation = useMutation({
    mutationFn: async (type: MemberDataLoveTypeCategoryEnum) => {
      const { data } = await memberService.updateMember({
        updateMemberRequestDto: { loveTypeCategory: type },
      })
      return data
    },
    onSuccess: async () => {
      await refreshUserInfo()
      navigateToNext()
    },
    onError: () => {
      toast.error('저장 중 오류가 발생했습니다')
    },
  })

  const navigateToNext = () => {
    if (flow === 'my-personality') {
      navigate({ to: '/attachment-test/result/my', search: { from: 'my-page' } })
    } else if (flow === 'chat-entry') {
      navigate({ to: '/my-result-preview', search: { flow, chatId } })
    } else {
      navigate({ to: '/attachment-test/result/my' })
    }
  }

  const handleSelect = (type: MemberDataLoveTypeCategoryEnum) => {
    if (updateMutation.isPending) return
    updateMutation.mutate(type)
  }

  const handleDontKnow = () => {
    navigate({
      to: '/attachment-test',
      search: { flow, chatId },
    })
  }

  return (
    <Screen>
      <Screen.Header behavior="overlay">
        <DetailHeaderBar center={getChatEntryProgressBar(flow === 'chat-entry', 2)} />
      </Screen.Header>

      <Screen.Content className="flex flex-1 flex-col bg-white">
        {getPersonalityStepDots(flow === 'my-personality', 2)}
        <TitleSection
          title={
            <>
              나의 애착 유형이
              <br />
              무엇인가요?
            </>
          }
        />

        <div className="mt-[68px] flex flex-col gap-3 px-5">
          {ATTACHMENT_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              disabled={updateMutation.isPending}
              className={cn(
                'w-full rounded-[10px] border border-gray-neutral-300 py-4 text-center transition-all',
                'body2-medium text-gray-iron-950'
              )}
            >
              {option.label}
            </button>
          ))}

          <button
            onClick={handleDontKnow}
            className="body2-medium w-full rounded-[10px] border border-gray-neutral-300 py-4 text-center text-gray-iron-500 transition-all"
          >
            내 애착유형을 모른다면? 테스트 GO
          </button>
        </div>

        <div className="mt-auto mb-5 px-5 pb-[var(--safe-bottom)]">
          <Button text="건너뛰기" type="secondary" onClick={navigateToNext} />
        </div>
      </Screen.Content>
    </Screen>
  )
}
