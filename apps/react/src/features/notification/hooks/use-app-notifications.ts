import { PendingNotificationData } from '@data/user-api-axios/api'
import { useEffect, useState } from 'react'

import { useProfileModal } from '@/features/profile/hooks/use-profile-modal'

import { usePendingNotificationsQuery, useProcessNotificationsMutation } from './use-notification'

export function useAppNotifications() {
  const [processedNotifications, setProcessedNotifications] = useState<Set<number>>(new Set())
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { coupleConnectedModal, coupleDisconnectedNotificationModal } = useProfileModal()
  const { data: notifications, error } = usePendingNotificationsQuery()
  const processNotificationsMutation = useProcessNotificationsMutation()

  // 에러가 발생하면 조기 반환
  if (error) {
    return {}
  }

  // 알림을 처리하는 함수
  const processNotification = (notificationId: number) => {
    processNotificationsMutation.mutate(
      {
        pendingNotifications: [notificationId],
      },
      {
        onSuccess: () => {
          // 성공 시에만 처리된 알림으로 마크하고 모달 상태 해제
          setProcessedNotifications((prev) => new Set([...prev, notificationId]))
          setIsModalOpen(false)
        },
        onError: () => {
          // 실패 시에도 모달 상태는 해제 (재시도는 하지 않음)
          setIsModalOpen(false)
        },
      }
    )
  }

  // 타입별 모달 표시 함수
  const showNotificationModal = (notification: PendingNotificationData) => {
    // 모달 오픈 상태로 설정 (중복 방지)
    setIsModalOpen(true)

    const handleNotificationComplete = () => {
      if (notification.id != null) {
        processNotification(notification.id)
      } else {
        // id가 없는 경우 모달만 닫기
        setIsModalOpen(false)
      }
    }

    switch (notification.type) {
      case 'COUPLE_CONNECTED':
        // 기존 커플 연결 모달 사용, 확인 버튼 클릭시 알림 처리
        coupleConnectedModal(handleNotificationComplete)
        break

      case 'COUPLE_DISCONNECTED':
        // 기존 커플 해제 알림 모달 사용, 확인/마이페이지 버튼 클릭시 알림 처리
        coupleDisconnectedNotificationModal(handleNotificationComplete, handleNotificationComplete)
        break

      default:
        // 다른 타입의 알림은 기본 처리
        handleNotificationComplete()
    }
  }

  // 알림 큐 처리: 다음 처리할 알림을 찾아서 모달 표시
  useEffect(() => {
    // 모달이 이미 열려있으면 중복 방지
    if (isModalOpen) return

    if (notifications?.data?.list && notifications.data.list.length > 0) {
      // 처리되지 않은 첫 번째 알림을 ID 기준으로 찾기
      const nextNotification = notifications.data.list.find(
        (notification) => notification.id != null && !processedNotifications.has(notification.id)
      )

      if (nextNotification) {
        showNotificationModal(nextNotification)
      }
    }
  }, [notifications, processedNotifications, isModalOpen])

  return {}
}
