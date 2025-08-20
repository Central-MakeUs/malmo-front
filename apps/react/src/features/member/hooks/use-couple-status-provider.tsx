import { useQueryClient } from '@tanstack/react-query'
import { ReactNode, useCallback } from 'react'

import { useCoupleStatusSSE } from '@/features/member/hooks/use-couple-status-sse'
import { useProfileModal } from '@/features/profile'
import { queryKeys } from '@/shared/services/query-keys'

export function CoupleStatusProvider({ children }: { children: ReactNode }) {
  try {
    const queryClient = useQueryClient()
    const { coupleConnectedModal, coupleDisconnectedNotificationModal } = useProfileModal()

    const handleCoupleConnected = useCallback(() => {
      // 데이터 정리
      queryClient.invalidateQueries({ queryKey: queryKeys.member.partnerInfo() })
      queryClient.invalidateQueries({ queryKey: ['auth', 'userInfo'] })

      // 커플 연결 완료 모달 표시
      coupleConnectedModal()
    }, [queryClient, coupleConnectedModal])

    const handleCoupleDisconnected = useCallback(async () => {
      // 데이터 정리
      await queryClient.setQueryData(queryKeys.member.partnerInfo(), null)
      queryClient.removeQueries({ queryKey: queryKeys.member.partnerInfo() })

      // 쿼리 무효화로 데이터 새로고침
      queryClient.invalidateQueries({ queryKey: ['auth', 'userInfo'] })

      // 커플 해제 알림 모달 표시
      coupleDisconnectedNotificationModal()
    }, [queryClient, coupleDisconnectedNotificationModal])

    // 커플 상태 SSE 구독
    useCoupleStatusSSE({
      onCoupleConnected: handleCoupleConnected,
      onCoupleDisconnected: handleCoupleDisconnected,
    })

    return <>{children}</>
  } catch (error) {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.error('[CoupleStatusProvider] 오류 발생:', error)
    }
    // 오류 발생 시에도 children은 렌더링
    return <>{children}</>
  }
}
