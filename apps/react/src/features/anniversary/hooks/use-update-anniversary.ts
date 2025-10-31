import { useMutation, useQueryClient } from '@tanstack/react-query'

import memberService from '@/shared/services/member.service'
import { queryKeys } from '@/shared/services/query-keys'

export function useUpdateStartDate(onCompleted: () => Promise<void> | void) {
  const queryClient = useQueryClient()
  const baseOptions = memberService.updateStartDateMutation()

  return useMutation({
    ...baseOptions,
    onSuccess: async () => {
      baseOptions.onSuccess?.()
      queryClient.setQueryData(queryKeys.member.partnerInfo(), null)
      await queryClient.invalidateQueries({ queryKey: queryKeys.member.partnerInfo() })
      await onCompleted()
    },
  })
}
