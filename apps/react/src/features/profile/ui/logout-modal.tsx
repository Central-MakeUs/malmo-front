import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/shared/components/alert-dialog'
import { useAuth } from '@/features/auth'
import { useAlertDialog } from '@/shared/hook/alert-dialog.hook'
import { useNavigate } from '@tanstack/react-router'

interface LogoutModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function LogoutModal({ isOpen, onOpenChange }: LogoutModalProps) {
  const { logout } = useAuth()
  const { open } = useAlertDialog()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      const result = await logout()
      if (result.success) {
        navigate({ to: '/login' })
      }
    } catch (error: any) {
      open({
        title: '로그아웃 실패',
        description: error.message || '로그아웃에 실패했습니다.',
        confirmText: '확인',
      })
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>로그아웃 하시겠어요?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleLogout}>로그아웃</AlertDialogCancel>
          <AlertDialogAction onClick={() => onOpenChange(false)}>취소</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
