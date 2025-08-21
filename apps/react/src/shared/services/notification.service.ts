import { MembersAlarmsApi, ProcessNotificationsRequestDto } from '@data/user-api-axios/api'

import { queryKeys } from './query-keys'
import apiInstance from '../lib/api'

export const QUERY_KEY = 'notifications'

class NotificationService extends MembersAlarmsApi {
  constructor() {
    super(undefined, '', apiInstance)
  }

  // === Query Options ===
  pendingNotificationsQuery() {
    return {
      queryKey: queryKeys.notification.pending(),
      queryFn: async () => {
        const { data } = await this.getMemberPendingNotification()
        return data
      },
    }
  }

  // === Mutation Options ===
  processNotificationsMutation() {
    return {
      mutationFn: async (body: ProcessNotificationsRequestDto) => {
        const { data } = await this.processNotifications({
          processNotificationsRequestDto: body,
        })
        return data
      },
      onError: () => {
        console.error('알림 처리 중 오류가 발생했습니다')
      },
    }
  }
}

export default new NotificationService()
