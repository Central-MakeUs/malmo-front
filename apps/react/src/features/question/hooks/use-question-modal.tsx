import { useAlertDialog } from '@/shared/hook/alert-dialog.hook'
import questionService from '@/shared/services/question.service'
import { useRouter } from '@tanstack/react-router'

export interface UseQuestionModalReturn {
  saveQuestionModal: (text: string) => void
  exitQuestionModal: () => void
}

export function useQuestionModal(): UseQuestionModalReturn {
  const alertDialog = useAlertDialog()
  const router = useRouter()

  const saveQuestionModal = (text: string) => {
    alertDialog.open({
      title: '답변을 저장하시겠어요?',
      description: '저장 이후에도 답변을 수정할 수 있어요.',
      cancelText: '이어서 작성하기',
      confirmText: '저장하기',
      onConfirm: async () => {
        alertDialog.close()
        await questionService.postTodayQuestionAnswer({ answer: text })
        router.history.back()
      },
    })
  }

  const exitQuestionModal = () => {
    alertDialog.open({
      title: '정말 나가시겠어요?',
      description: (
        <>
          지금 나가면 작성중인 답변은 사라져요.
          <br />
          계속하시겠어요?
        </>
      ),
      cancelText: '나가기',
      confirmText: '이어서 작성하기',
      onCancel: () => {
        alertDialog.close()
        router.history.back()
      },
    })
  }

  return {
    saveQuestionModal,
    exitQuestionModal,
  }
}
