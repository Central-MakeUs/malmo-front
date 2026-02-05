import { useMutation } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

import { useAuth } from '@/features/auth'
import { MbtiForm } from '@/features/onboarding/ui/mbti-form'
import { wrapWithTracking } from '@/shared/analytics'
import { BUTTON_NAMES, CATEGORIES } from '@/shared/analytics/constants'
import { useGoBack } from '@/shared/navigation/use-go-back'
import memberService from '@/shared/services/member.service'
import { toast } from '@/shared/ui/toast'

import type { UpdateMemberRequestDto } from '@data/user-api-axios/api'

export const Route = createFileRoute('/partner-mbti/')({
  component: PartnerMbtiEditPage,
})

function PartnerMbtiEditPage() {
  const goBack = useGoBack()
  const { userInfo, refreshUserInfo } = useAuth()

  const updateMutation = useMutation({
    mutationFn: async (body: UpdateMemberRequestDto) => {
      const { data } = await memberService.updateMember({ updateMemberRequestDto: body })
      return data
    },
    onSuccess: async () => {
      toast.success('상대 성향이 변경되었어요!')
      await refreshUserInfo()
      goBack()
    },
    onError: () => {
      toast.error('상대 성향 변경 중 오류가 발생했습니다')
    },
  })

  const handleSave = wrapWithTracking(BUTTON_NAMES.SAVE_PROFILE_PARTNER_MBTI, CATEGORIES.PROFILE, () => {
    if (updateMutation.isPending) return
  })

  return (
    <MbtiForm
      headerTitle="상대 성향"
      title={
        <>
          상대방 MBTI 성향은
          <br />
          무엇인가요?
        </>
      }
      initialValue={userInfo.otherPersonalityType}
      submitText="저장"
      isSubmitting={updateMutation.isPending}
      onSubmit={(mbti) => {
        if (updateMutation.isPending) return
        handleSave()
        updateMutation.mutate({ otherPersonalityType: mbti })
      }}
    />
  )
}
