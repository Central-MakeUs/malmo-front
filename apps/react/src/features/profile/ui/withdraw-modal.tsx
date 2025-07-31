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
import { useAuth } from '@/features/auth'
import { useAlertDialog } from '@/shared/hook/alert-dialog.hook'
import { useNavigate } from '@tanstack/react-router'
import memberService from '@/shared/services/member.service'

interface WithdrawModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function WithdrawModal({ isOpen, onOpenChange }: WithdrawModalProps) {
  const { logout } = useAuth()
  const { open } = useAlertDialog()
  const navigate = useNavigate()

  const handleWithdraw = async () => {
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
      open({
        title: '회원 탈퇴 실패',
        description: error.message || '회원 탈퇴에 실패했습니다.',
        confirmText: '확인',
      })
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>정말 계정을 탈퇴하시겠어요?</AlertDialogTitle>
          <AlertDialogDescription>
            탈퇴 시 커플 연동이 자동으로 끊기며 모든 기록은 복구할 수 없어요.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleWithdraw}>탈퇴하기</AlertDialogCancel>
          <AlertDialogAction onClick={() => onOpenChange(false)}>취소</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
