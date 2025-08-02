import { useAlertDialog } from '@/shared/hook/alert-dialog.hook'
import historyService from '@/shared/services/history.service'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { queryKeys } from '@/shared/query-keys'

export interface UseHistoryModalReturn {
  deleteChatHistoryModal: (id: number) => void
  deleteChatHistoriesModal: (ids: number[], onFinish: () => void) => void
}

export function useHistoryModal(): UseHistoryModalReturn {
  const alertDialog = useAlertDialog()
  const router = useRouter()
  const queryClient = useQueryClient()

  const deleteHistoryMutation = useMutation({
    ...historyService.deleteHistoryMutation(),
    onSuccess: async () => {
      // 히스토리 관련 쿼리 캐시 무효화
      await queryClient.invalidateQueries({ queryKey: queryKeys.history.all })
    },
  })

  const deleteChatHistoryModal = (id: number) => {
    alertDialog.open({
      title: '대화 기록을 삭제할까요?',
      description: '삭제하면 기록을 되돌릴 수 없어요.',
      cancelText: '삭제하기',
      confirmText: '취소하기',
      onCancel: async () => {
        alertDialog.close()
        await deleteHistoryMutation.mutateAsync([id])
        router.history.back()
      },
    })
  }

  const deleteChatHistoriesModal = (ids: number[], onFinish: () => void) => {
    alertDialog.open({
      title: '대화 기록을 삭제할까요?',
      description: (
        <>
          삭제하면 기록을 되돌릴 수 없고
          <br />
          모모가 이 기록을 상담에 반영하지 않아요.
        </>
      ),
      cancelText: '삭제하기',
      confirmText: '취소하기',
      onCancel: async () => {
        alertDialog.close()
        await deleteHistoryMutation.mutateAsync(ids)
        onFinish()
      },
    })
  }

  return {
    deleteChatHistoryModal,
    deleteChatHistoriesModal,
  }
}
