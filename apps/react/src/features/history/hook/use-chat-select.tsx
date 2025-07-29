import { useChattingModal } from '@/features/chat/hook/use-chatting-modal'
import { GetChatRoomListResponse } from '@data/user-api-axios/api'
import { Link } from '@tanstack/react-router'
import { useState } from 'react'

export const useChatSelect = (histories: GetChatRoomListResponse[]) => {
  const chattingModal = useChattingModal()
  const [selectedIds, setSelectedIds] = useState<number[]>([])

  const handleToggleSelect = (id?: number) => {
    if (id === undefined) return
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const isAllSelected = histories.length > 0 && selectedIds.length === histories.length

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([])
    } else {
      setSelectedIds(histories.map((h) => h.chatRoomId).filter((id): id is number => id !== undefined))
    }
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
    isAllSelected,
    handleToggleSelect,
    handleSelectAll,
    handleDelete,
    backButton,
  }
}
