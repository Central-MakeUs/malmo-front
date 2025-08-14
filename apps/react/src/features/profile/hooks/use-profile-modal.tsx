import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'

import MomoConnectedImage from '@/assets/images/momo-connected.png'
import { useAuth } from '@/features/auth'
import { useAlertDialog } from '@/shared/hooks/use-alert-dialog'
import coupleService from '@/shared/services/couple.service'
import memberService from '@/shared/services/member.service'

export interface UseProfileModalReturn {
  logoutModal: () => void
  withdrawModal: () => void
  coupleDisconnectModal: (onSuccess?: () => void) => void
  coupleConnectedModal: () => void
}

export function useProfileModal(): UseProfileModalReturn {
  const alertDialog = useAlertDialog()
  const { logout, refreshUserInfo } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // 회원 탈퇴 뮤테이션
  const deleteMemberServiceOptions = memberService.deleteMemberMutation()
  const deleteMemberMutation = useMutation({
    ...deleteMemberServiceOptions,
    onSuccess: async (result) => {
      if (result?.success) {
        // 로그아웃 처리
        await logout()

        await queryClient.cancelQueries({ predicate: () => true })
        queryClient.clear()

        navigate({ to: '/login' })
      } else {
        throw new Error(result?.message || '회원 탈퇴에 실패했습니다.')
      }
    },
    onError: () => {
      // 서비스단 에러
      deleteMemberServiceOptions.onError?.()
      // 다이얼로그 닫기
      alertDialog.close()
    },
  })

  // 커플 연결 끊기 뮤테이션
  const disconnectCoupleServiceOptions = coupleService.disconnectCoupleMutation()
  const disconnectCoupleMutation = useMutation({
    ...disconnectCoupleServiceOptions,
    onSuccess: async () => {
      disconnectCoupleServiceOptions.onSuccess?.()
      await refreshUserInfo()
    },
    onError: () => {
      // 서비스단 에러
      disconnectCoupleServiceOptions.onError?.()
      // 다이얼로그 닫기
      alertDialog.close()
    },
  })

  const logoutModal = () => {
    alertDialog.open({
      title: '로그아웃 하시겠어요?',
      description: <>고민이 있을 때, 언제든 찾아와 주세요!</>,
      cancelText: '로그아웃',
      confirmText: '취소',
      onCancel: async () => {
        try {
          const result = await logout()
          if (result.success) {
            navigate({ to: '/login' })
          }
        } catch {
          alertDialog.close()
          // TODO: 에러 처리
        }
      },
    })
  }

  const withdrawModal = () => {
    alertDialog.open({
      title: '정말 계정을 탈퇴하시겠어요?',
      description: (
        <>
          탈퇴 시 커플 연동이 자동으로 끊기며
          <br /> 모든 기록은 복구할 수 없어요.
        </>
      ),
      cancelText: '탈퇴하기',
      confirmText: '취소',
      onCancel: () => {
        deleteMemberMutation.mutate()
      },
    })
  }

  const coupleDisconnectModal = (onSuccess?: () => void) => {
    alertDialog.open({
      title: '정말 커플 연동을 끊으시겠어요?',
      description: (
        <>
          커플 연결을 끊으면 데이터가 모두 삭제돼요.
          <br />
          30일 이내로 다시 연동하면 복구할 수 있어요.
        </>
      ),
      cancelText: '연결 끊기',
      confirmText: '취소하기',
      onCancel: () => {
        disconnectCoupleMutation.mutate(undefined, {
          onSuccess: () => {
            onSuccess?.()
          },
        })
      },
    })
  }

  const coupleConnectedModal = () => {
    alertDialog.open({
      title: '커플 연동이 완료되었어요!',
      description: '이제 말모를 제한 없이 사용할 수 있어요!',
      image: <img src={MomoConnectedImage} alt="연결 완료" className="h-[164px] w-[184px]" />,
      confirmText: '확인',
      onConfirm: async () => {
        await refreshUserInfo()
      },
    })
  }

  return {
    logoutModal,
    withdrawModal,
    coupleDisconnectModal,
    coupleConnectedModal,
  }
}
