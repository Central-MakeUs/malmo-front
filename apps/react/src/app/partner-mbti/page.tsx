import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'

import { useAuth } from '@/features/auth'
import { MbtiForm } from '@/features/onboarding/ui/mbti-form'
import { useUpsertPartnerProfileMutation } from '@/features/profile'
import { navigateAfterPartnerMbti, personalityFlowSearchSchema } from '@/features/profile/lib/personality-flow'
import { wrapWithTracking } from '@/shared/analytics'
import { BUTTON_NAMES, CATEGORIES } from '@/shared/analytics/constants'
import { useGoBack } from '@/shared/navigation/use-go-back'
import { getChatEntryProgressBar } from '@/shared/ui/flow-progress-bar'
import { getPersonalityStepDots } from '@/shared/ui/flow-step-dots'
import { toast } from '@/shared/ui/toast'

export const Route = createFileRoute('/partner-mbti/')({
  validateSearch: personalityFlowSearchSchema,
  component: PartnerMbtiEditPage,
})

function PartnerMbtiEditPage() {
  const navigate = useNavigate()
  const goBack = useGoBack()
  const { userInfo } = useAuth()
  const { flow, chatId } = useSearch({ from: Route.id })

  const updateMutation = useUpsertPartnerProfileMutation({
    onSuccess: () => {
      const navigated = navigateAfterPartnerMbti(navigate, flow, chatId)
      if (!navigated) {
        toast.success('상대 성향이 변경되었어요!')
        goBack()
      }
    },
    errorMessage: '상대 성향 변경 중 오류가 발생했습니다',
  })

  const trackSave = wrapWithTracking(BUTTON_NAMES.SAVE_PROFILE_PARTNER_MBTI, CATEGORIES.PROFILE)

  const handleSubmit = (mbti: string) => {
    if (updateMutation.isPending) return
    trackSave()
    updateMutation.mutate({ personalityType: mbti })
  }

  const isFlowMode = !!flow

  return (
    <MbtiForm
      headerTitle={isFlowMode ? undefined : '상대 성향'}
      navCenter={getChatEntryProgressBar(flow === 'chat-entry', 4)}
      contentTopSlot={getPersonalityStepDots(flow === 'partner-personality', 1)}
      title={
        <>
          상대방 MBTI 성향은
          <br />
          무엇인가요?
        </>
      }
      initialValue={userInfo.otherPersonalityType}
      submitText={isFlowMode ? '다음' : '변경하기'}
      requireChangeForSubmit={!isFlowMode}
      isSubmitting={updateMutation.isPending}
      onSubmit={handleSubmit}
      onBack={undefined}
    />
  )
}
