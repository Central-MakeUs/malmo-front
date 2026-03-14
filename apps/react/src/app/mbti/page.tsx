// @deprecated 홈 화면 필수 입력 플로우에서 제거됨. 마이페이지 MBTI 수정 연동 여부 확인 후 삭제
import { useMutation } from '@tanstack/react-query'
import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'

import { useAuth } from '@/features/auth'
import { MbtiForm } from '@/features/onboarding/ui/mbti-form'
import { requiredProfileFlowSearchSchema } from '@/features/profile/lib/required-profile-flow'
import { wrapWithTracking } from '@/shared/analytics'
import { BUTTON_NAMES, CATEGORIES } from '@/shared/analytics/constants'
import { useGoBack } from '@/shared/navigation/use-go-back'
import memberService from '@/shared/services/member.service'
import { toast } from '@/shared/ui/toast'

import type { UpdateMemberRequestDto } from '@data/user-api-axios/api'

export const Route = createFileRoute('/mbti/')({
  validateSearch: requiredProfileFlowSearchSchema,
  component: MbtiEditPage,
})

function MbtiEditPage() {
  const navigate = useNavigate()
  const goBack = useGoBack()
  const { userInfo, refreshUserInfo } = useAuth()
  const { requiredProfileFlow } = useSearch({ from: Route.id })
  const isRequiredProfileFlow = requiredProfileFlow === true

  const updateMutation = useMutation({
    mutationFn: async (body: UpdateMemberRequestDto) => {
      const { data } = await memberService.updateMember({ updateMemberRequestDto: body })
      return data
    },
    onSuccess: async () => {
      await refreshUserInfo()
      if (isRequiredProfileFlow) {
        navigate({ to: '/partner-mbti', search: { requiredProfileFlow: true }, replace: true })
        return
      }
      toast.success('내 성향이 변경되었어요!')
      goBack()
    },
    onError: () => {
      toast.error('내 성향 변경 중 오류가 발생했습니다')
    },
  })

  const trackSave = wrapWithTracking(BUTTON_NAMES.SAVE_PROFILE_MBTI, CATEGORIES.PROFILE)

  const handleSubmit = (mbti: string) => {
    if (updateMutation.isPending) return
    trackSave()
    updateMutation.mutate({ personalityType: mbti })
  }

  const handleBack = isRequiredProfileFlow
    ? () => navigate({ to: '/relationship-status', search: { requiredProfileFlow: true }, replace: true })
    : undefined

  return (
    <MbtiForm
      headerTitle={isRequiredProfileFlow ? undefined : '내 성향'}
      title={
        <>
          나의 MBTI 성향은
          <br />
          무엇인가요?
        </>
      }
      initialValue={userInfo.personalityType}
      submitText={isRequiredProfileFlow ? '다음' : '변경하기'}
      requireChangeForSubmit={!isRequiredProfileFlow}
      isSubmitting={updateMutation.isPending}
      onSubmit={handleSubmit}
      onBack={handleBack}
    />
  )
}
