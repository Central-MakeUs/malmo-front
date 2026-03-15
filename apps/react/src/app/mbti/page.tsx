import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'

import { useAuth } from '@/features/auth'
import { MbtiForm } from '@/features/onboarding/ui/mbti-form'
import { useMemberUpdateMutation } from '@/features/profile'
import { personalityFlowSearchSchema } from '@/features/profile/lib/personality-flow'
import { wrapWithTracking } from '@/shared/analytics'
import { BUTTON_NAMES, CATEGORIES } from '@/shared/analytics/constants'
import { useGoBack } from '@/shared/navigation/use-go-back'
import { getChatEntryProgressBar } from '@/shared/ui/flow-progress-bar'
import { getPersonalityStepDots } from '@/shared/ui/flow-step-dots'
import { toast } from '@/shared/ui/toast'

export const Route = createFileRoute('/mbti/')({
  validateSearch: personalityFlowSearchSchema,
  component: MbtiEditPage,
})

function MbtiEditPage() {
  const navigate = useNavigate()
  const goBack = useGoBack()
  const { userInfo } = useAuth()
  const { flow, chatId } = useSearch({ from: Route.id })

  const updateMutation = useMemberUpdateMutation({
    onSuccess: () => {
      if (flow === 'my-personality') {
        navigate({ to: '/my-attachment-select', search: { flow } })
        return
      }

      if (flow === 'chat-entry') {
        navigate({ to: '/my-attachment-select', search: { flow, chatId } })
        return
      }

      toast.success('내 성향이 변경되었어요!')
      goBack()
    },
    errorMessage: '내 성향 변경 중 오류가 발생했습니다',
  })

  const trackSave = wrapWithTracking(BUTTON_NAMES.SAVE_PROFILE_MBTI, CATEGORIES.PROFILE)

  const handleSubmit = (mbti: string) => {
    if (updateMutation.isPending) return
    trackSave()
    updateMutation.mutate({ personalityType: mbti })
  }

  const isFlowMode = !!flow

  return (
    <MbtiForm
      headerTitle={isFlowMode ? undefined : '내 성향'}
      navCenter={getChatEntryProgressBar(flow === 'chat-entry', 1)}
      contentTopSlot={getPersonalityStepDots(flow === 'my-personality', 1)}
      title={
        <>
          나의 MBTI 성향은
          <br />
          무엇인가요?
        </>
      }
      initialValue={userInfo.personalityType}
      submitText={isFlowMode ? '다음' : '변경하기'}
      requireChangeForSubmit={!isFlowMode}
      isSubmitting={updateMutation.isPending}
      onSubmit={handleSubmit}
      onBack={undefined}
    />
  )
}
