import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'

import { wrapWithTracking } from '@/shared/analytics'
import { BUTTON_NAMES, CATEGORIES } from '@/shared/analytics/constants'

import { useHistoryModal } from './use-history-modal'

export const useChatSelect = () => {
  const historyModal = useHistoryModal()
  const navigate = useNavigate()
  const [selectedIds, setSelectedIds] = useState<number[]>([])

  const handleToggleSelect = wrapWithTracking(BUTTON_NAMES.SELECT_ITEM, CATEGORIES.MAIN, (id?: number) => {
    if (id === undefined) return
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  })

  const handleDelete = wrapWithTracking(BUTTON_NAMES.DELETE_SELECTED, CATEGORIES.MAIN, () =>
    historyModal.deleteChatHistoriesModal(selectedIds, () => setSelectedIds([]))
  )

  const backButton = () => (
    <button
      type="button"
      className="body2-medium text-gray-iron-900"
      onClick={wrapWithTracking(BUTTON_NAMES.BACK_DELETE, CATEGORIES.MAIN, () =>
        navigate({ to: '/history', replace: true, state: { skipTransition: true } })
      )}
    >
      완료
    </button>
  )

  return {
    selectedIds,
    handleToggleSelect,
    handleDelete,
    backButton,
  }
}
