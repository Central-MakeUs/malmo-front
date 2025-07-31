import { useState } from 'react'
import { useAlertDialog } from '@/shared/hook/alert-dialog.hook'
import { useAuth } from '@/features/auth'
import { useNavigate } from '@tanstack/react-router'
import memberService from '@/shared/services/member.service'
import coupleService from '@/shared/services/couple.service'
import { CoupleConnectedModal } from '../ui/couple-connected-modal'

export interface UseProfileModalReturn {
  logoutModal: () => void
  withdrawModal: () => void
  coupleDisconnectModal: (onSuccess?: () => void) => void
  showCoupleConnectedModal: () => void
  CoupleConnectedModal: React.ReactNode
}

export function useProfileModal(): UseProfileModalReturn {
  const alertDialog = useAlertDialog()
  const { logout, refreshUserInfo } = useAuth()
  const navigate = useNavigate()
  const [coupleConnectedModalOpen, setCoupleConnectedModalOpen] = useState(false)

  const logoutModal = () => {
    alertDialog.open({
      title: '로그아웃 하시겠어요?',
      cancelText: '로그아웃',
      confirmText: '취소',
      onCancel: async () => {
        try {
          const result = await logout()
          if (result.success) {
            navigate({ to: '/login' })
          }
        } catch (error: any) {
          alertDialog.close()
          // TODO: 에러 처리
        }
      },
    })
  }

  const withdrawModal = () => {
    alertDialog.open({
      title: '정말 계정을 탈퇴하시겠어요?',
      description: '탈퇴 시 커플 연동이 자동으로 끊기며 모든 기록은 복구할 수 없어요.',
      cancelText: '탈퇴하기',
      confirmText: '취소',
      onCancel: async () => {
        try {
          const result = await memberService.deleteMember()
          if (result.data?.success) {
            // 로그아웃 처리
            await logout()
            navigate({ to: '/login' })
          } else {
            throw new Error(result.data?.message || '회원 탈퇴에 실패했습니다.')
          }
        } catch (error: any) {
          alertDialog.close()
          // TODO: 에러 처리
        }
      },
    })
  }

  const coupleDisconnectModal = (onSuccess?: () => void) => {
    alertDialog.open({
      title: '정말 커플 연동을 끊으시겠어요?',
      description: '커플 연결을 끊으면 데이터가 모두 삭제돼요.30일 이내로 다시 연동하면 복구할 수 있어요.',
      cancelText: '연결 끊기',
      confirmText: '취소하기',
      onCancel: async () => {
        try {
          await coupleService.disconnectCouple()
          await refreshUserInfo()
          onSuccess?.()
        } catch (error: any) {
          alertDialog.close()
          // TODO: 에러 처리
        }
      },
    })
  }

  const showCoupleConnectedModal = () => {
    setCoupleConnectedModalOpen(true)
  }

  const hideCoupleConnectedModal = () => {
    setCoupleConnectedModalOpen(false)
  }

  return {
    logoutModal,
    withdrawModal,
    coupleDisconnectModal,
    showCoupleConnectedModal,
    CoupleConnectedModal: (
      <CoupleConnectedModal isOpen={coupleConnectedModalOpen} onOpenChange={hideCoupleConnectedModal} />
    ),
  }
}
