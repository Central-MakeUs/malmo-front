import { UpdateMemberRequestDtoRelationshipStatusEnum, type UpdateMemberRequestDto } from '@data/user-api-axios/api'
import { useMutation } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

import { useAuth } from '@/features/auth'
import { RelationshipStatusForm } from '@/features/onboarding/ui/relationship-status-form'
import { wrapWithTracking } from '@/shared/analytics'
import { BUTTON_NAMES, CATEGORIES } from '@/shared/analytics/constants'
import { useGoBack } from '@/shared/navigation/use-go-back'
import memberService from '@/shared/services/member.service'
import { toast } from '@/shared/ui/toast'

export const Route = createFileRoute('/relationship-status/')({
  component: RelationshipStatusEditPage,
})

type RelationshipStatus = UpdateMemberRequestDtoRelationshipStatusEnum

const RELATIONSHIP_OPTIONS: {
  value: RelationshipStatus
  label: string
}[] = [
  { value: 'SEEING_SOMEONE', label: '썸을 타고 있거나, 관계가 진전되기 전이에요' },
  { value: 'IN_RELATIONSHIP', label: '연애 중이에요' },
  { value: 'BREAKUP', label: '이별했어요' },
]

function RelationshipStatusEditPage() {
  const goBack = useGoBack()
  const { userInfo, refreshUserInfo } = useAuth()

  const updateMutation = useMutation({
    mutationFn: async (body: UpdateMemberRequestDto) => {
      const { data } = await memberService.updateMember({ updateMemberRequestDto: body })
      return data
    },
    onSuccess: async () => {
      toast.success('연애 상태가 변경되었어요!')
      await refreshUserInfo()
      goBack()
    },
    onError: () => {
      toast.error('연애 상태 변경 중 오류가 발생했습니다')
    },
  })

  const trackSave = wrapWithTracking(BUTTON_NAMES.SAVE_PROFILE_RELATIONSHIP_STATUS, CATEGORIES.PROFILE)

  const handleSubmit = (value: string) => {
    if (updateMutation.isPending) return
    trackSave()
    updateMutation.mutate({ relationshipStatus: value as RelationshipStatus })
  }

  return (
    <RelationshipStatusForm
      headerTitle="현재 연애 상태"
      title={
        <>
          현재 연애 상태를
          <br />
          선택해 주세요
        </>
      }
      description="이후에 관계 정보가 바뀌면 변경할 수 있어요"
      options={RELATIONSHIP_OPTIONS}
      initialValue={(userInfo.relationshipStatus as RelationshipStatus | undefined) ?? null}
      submitText="변경하기"
      requireChangeForSubmit
      isSubmitting={updateMutation.isPending}
      onSubmit={handleSubmit}
    />
  )
}
