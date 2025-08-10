import { Link } from '@tanstack/react-router'
import { useState } from 'react'

import { useHistoryModal } from './use-history-modal'

export const useChatSelect = () => {
  const historyModal = useHistoryModal()
  const [selectedIds, setSelectedIds] = useState<number[]>([])

  const handleToggleSelect = (id?: number) => {
    if (id === undefined) return
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const handleDelete = () => {
    historyModal.deleteChatHistoriesModal(selectedIds, () => setSelectedIds([]))
  }

  const backButton = () => (
    <Link to="/history" replace>
      <p className="body2-medium text-gray-iron-900">완료</p>
    </Link>
  )

  return {
    selectedIds,
    handleToggleSelect,
    handleDelete,
    backButton,
  }
}
