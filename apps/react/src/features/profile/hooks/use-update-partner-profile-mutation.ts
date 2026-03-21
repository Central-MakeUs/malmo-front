import { useMutation, useQueryClient } from '@tanstack/react-query'

import { useAuth } from '@/features/auth'
import memberService from '@/shared/services/member.service'
import { queryKeys } from '@/shared/services/query-keys'
import { toast } from '@/shared/ui/toast'

import type { UpdatePartnerProfileRequestDto } from '@data/user-api-axios/api'

interface Options {
  onSuccess: () => void | Promise<void>
  errorMessage?: string
}

/** 파트너 프로필 PATCH 전용 뮤테이션 훅 */
export function useUpdatePartnerProfileMutation({ onSuccess, errorMessage }: Options) {
  const { refreshUserInfo } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (body: UpdatePartnerProfileRequestDto) => {
      const { data } = await memberService.updatePartnerProfile({ updatePartnerProfileRequestDto: body })
      return data
    },
    onSuccess: async () => {
      await Promise.all([
        refreshUserInfo(),
        queryClient.invalidateQueries({ queryKey: queryKeys.member.partnerInfo() }),
      ])
      await onSuccess()
    },
    onError: () => {
      toast.error(errorMessage ?? '상대 프로필 수정 중 오류가 발생했습니다')
    },
  })
}
