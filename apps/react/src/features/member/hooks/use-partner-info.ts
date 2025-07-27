import { useQuery } from '@tanstack/react-query'
import memberService from '@/shared/services/member.service'

export function usePartnerInfo() {
  return useQuery({
    queryKey: ['partnerInfo'],
    queryFn: () => memberService.partner(),
    retry: false, // 403 에러시 재시도 안함
    select: (data) => data?.data,
  })
}
