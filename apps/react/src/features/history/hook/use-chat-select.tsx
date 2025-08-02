import { useChattingModal } from '@/features/chat/hook/use-chatting-modal'
import { GetChatRoomListResponse } from '@data/user-api-axios/api'
import { Link } from '@tanstack/react-router'
import { useState } from 'react'

export const useChatSelect = () => {
  const chattingModal = useChattingModal()
  const [selectedIds, setSelectedIds] = useState<number[]>([])

  const handleToggleSelect = (id?: number) => {
    if (id === undefined) return
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const handleDelete = () => {
    chattingModal.deleteChatHistoriesModal(selectedIds, () => setSelectedIds([]))
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
