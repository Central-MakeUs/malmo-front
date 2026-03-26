import { useMutation, useQueryClient } from '@tanstack/react-query'

import { useAuth } from '@/features/auth'
import memberService from '@/shared/services/member.service'
import { queryKeys } from '@/shared/services/query-keys'
import { toast } from '@/shared/ui/toast'

import type { CreatePartnerProfileRequestDto } from '@data/user-api-axios/api'

interface Options {
  onSuccess: () => void | Promise<void>
  errorMessage?: string
}

/** 파트너 프로필 POST 시도 → 40017(already exists)이면 PATCH로 fallback */
export function useUpsertPartnerProfileMutation({ onSuccess, errorMessage }: Options) {
  const { refreshUserInfo } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (body: CreatePartnerProfileRequestDto) => {
      try {
        const { data } = await memberService.createPartnerProfile({ createPartnerProfileRequestDto: body })
        return data
      } catch (error: unknown) {
        const code = (error as { response?: { data?: { code?: number } } })?.response?.data?.code
        if (code === 40017) {
          const { data } = await memberService.updatePartnerProfile({
            updatePartnerProfileRequestDto: body,
          })
          return data
        }
        throw error
      }
    },
    onSuccess: async () => {
      await Promise.all([
        refreshUserInfo(),
        queryClient.invalidateQueries({ queryKey: queryKeys.member.partnerInfo() }),
      ])
      await onSuccess()
    },
    onError: () => {
      toast.error(errorMessage ?? '상대 프로필 저장 중 오류가 발생했습니다')
    },
  })
}
