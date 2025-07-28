import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/shared/components/alert-dialog'
import coupleService from '@/shared/services/couple.service'
import { useAuth } from '@/features/auth'
import { useAlertDialog } from '@/shared/hook/alert-dialog.hook'

interface CoupleDisconnectModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function CoupleDisconnectModal({ isOpen, onOpenChange, onSuccess }: CoupleDisconnectModalProps) {
  const { refreshUserInfo } = useAuth()
  const { open } = useAlertDialog()

  const handleDisconnect = async () => {
    try {
      await coupleService.disconnectCouple()

      // 사용자 정보 새로고침
      await refreshUserInfo()

      // 모달 닫기
      onOpenChange(false)

      // 성공 콜백 호출
      onSuccess?.()

      // TODO: 토스트 메시지 표시
      console.log('커플 연결이 끊어졌습니다')
    } catch (error: any) {
      open({
        title: '연결 끊기 실패',
        description: error.message || '연결 끊기에 실패했습니다.',
        confirmText: '확인',
      })
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>정말 커플 연동을 끊으시겠어요?</AlertDialogTitle>
          <AlertDialogDescription>
            커플 연결을 끊으면 데이터가 모두 삭제돼요.30일 이내로 다시 연동하면 복구할 수 있어요.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onOpenChange(false)}>취소하기</AlertDialogCancel>
          <AlertDialogAction onClick={handleDisconnect}>연결 끊기</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
