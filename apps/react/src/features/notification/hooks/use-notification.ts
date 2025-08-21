import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import notificationService from '@/shared/services/notification.service'
import { queryKeys } from '@/shared/services/query-keys'

// 미조회 알림 조회
export function usePendingNotificationsQuery() {
  return useQuery(notificationService.pendingNotificationsQuery())
}

// 알림 처리
export function useProcessNotificationsMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    ...notificationService.processNotificationsMutation(),
    onSuccess: () => {
      // 알림 처리 후 미조회 알림 목록 갱신
      queryClient.invalidateQueries({
        queryKey: queryKeys.notification.pending(),
      })
    },
  })
}
