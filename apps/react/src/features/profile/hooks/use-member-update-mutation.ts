import { useMutation } from '@tanstack/react-query'

import { useAuth } from '@/features/auth'
import memberService from '@/shared/services/member.service'
import { toast } from '@/shared/ui/toast'

import type { UpdateMemberRequestDto } from '@data/user-api-axios/api'

interface UseMemberUpdateMutationOptions {
  onSuccess: () => void | Promise<void>
  errorMessage?: string
}

/** 회원 정보 업데이트 후 userInfo를 갱신하는 공통 뮤테이션 훅 */
export function useMemberUpdateMutation({ onSuccess, errorMessage }: UseMemberUpdateMutationOptions) {
  const { refreshUserInfo } = useAuth()

  return useMutation({
    mutationFn: async (body: UpdateMemberRequestDto) => {
      const { data } = await memberService.updateMember({ updateMemberRequestDto: body })
      return data
    },
    onSuccess: async () => {
      await refreshUserInfo()
      await onSuccess()
    },
    onError: () => {
      toast.error(errorMessage ?? '저장 중 오류가 발생했습니다')
    },
  })
}
