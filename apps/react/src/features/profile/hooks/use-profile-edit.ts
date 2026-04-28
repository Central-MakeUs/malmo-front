import { useState } from 'react'

export function useProfileEdit() {
  const [isNicknameSheetOpen, setIsNicknameSheetOpen] = useState(false)

  const openNicknameSheet = () => {
    setIsNicknameSheetOpen(true)
  }
  const setNicknameSheetOpen = (open: boolean) => {
    setIsNicknameSheetOpen(open)
  }

  return {
    isNicknameSheetOpen,
    openNicknameSheet,
    setNicknameSheetOpen,
  }
}
