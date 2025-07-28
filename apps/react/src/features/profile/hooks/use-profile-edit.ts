import { useState } from 'react'

export function useProfileEdit() {
  const [isNicknameSheetOpen, setIsNicknameSheetOpen] = useState(false)

  const openNicknameSheet = () => setIsNicknameSheetOpen(true)
  const setNicknameSheetOpen = (open: boolean) => setIsNicknameSheetOpen(open)

  return {
    // 닉네임 관련
    isNicknameSheetOpen,
    openNicknameSheet,
    setNicknameSheetOpen,
  }
}
