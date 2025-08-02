import { useAlertDialog } from '@/shared/hook/alert-dialog.hook'
import questionService from '@/shared/services/question.service'
import { useRouter } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'

export interface UseQuestionModalReturn {
  saveQuestionModal: (text: string, isEdit: boolean) => void
  exitQuestionModal: () => void
}

export function useQuestionModal(): UseQuestionModalReturn {
  const alertDialog = useAlertDialog()
  const router = useRouter()

  const submitAnswerMutation = useMutation(questionService.submitAnswerMutation())
  const updateAnswerMutation = useMutation(questionService.updateAnswerMutation())

  const saveQuestionModal = (text: string, isEdit: boolean) => {
    alertDialog.open({
      title: '답변을 작성하시겠어요?',
      description: '저장 이후에도 답변을 수정할 수 있어요.',
      cancelText: '이어서 작성하기',
      confirmText: '저장하기',
      onConfirm: () => {
        alertDialog.close()

        const mutation = isEdit ? updateAnswerMutation : submitAnswerMutation

        mutation.mutate(
          { answer: text },
          {
            onSuccess: (data) => {
              if (!data?.coupleQuestionId) {
                alertDialog.open({
                  title: '저장 실패',
                  description: '답변 저장에 실패했어요. 다시 시도해주세요.',
                  confirmText: '확인',
                })
                return
              }

              router.navigate({
                to: '/question/see-answer',
                search: { coupleQuestionId: data?.coupleQuestionId },
                replace: true,
              })
            },
            onError: () => {
              alertDialog.open({
                title: '저장 실패',
                description: '답변 저장에 실패했어요. 다시 시도해주세요.',
                confirmText: '확인',
              })
            },
          }
        )
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
