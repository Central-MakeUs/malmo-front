import { useAlertDialog } from '@/shared/hook/alert-dialog.hook'
import { useRouter } from '@tanstack/react-router'

export function useChattingModal() {
  const alertDialog = useAlertDialog()
  const router = useRouter()

  const testRequiredModal = () => {
    alertDialog.open({
      title: (
        <>
          모모와 대화를 시작하려면
          <br /> 애착유형 검사가 필요해요!
        </>
      ),
      description: (
        <>
          검사를 완료하면, 모모가 애착유형을 바탕으로
          <br /> 상담을 도와 드려요.
        </>
      ),
      cancelText: '다음에 하기',
      confirmText: '검사하러 가기',
    })
  }

  const exitChattingModal = () => {
    alertDialog.open({
      title: (
        <>
          아직 대화가 진행 중이에요!
          <br /> 지금 나가시겠어요?
        </>
      ),
      description: (
        <>
          검사를 완료하면, 모모가 애착유형을 바탕으로
          <br /> 상담을 도와 드려요.
        </>
      ),
      cancelText: '나가기',
      confirmText: '이어서 대화하기',
      onCancel: () => {
        alertDialog.close()
        router.history.back()
      },
    })
  }

  return { testRequiredModal, exitChattingModal }
}
