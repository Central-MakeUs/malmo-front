import { useState } from 'react'

export function useProfileEdit() {
  const [isNicknameSheetOpen, setIsNicknameSheetOpen] = useState(false)
  const [isAnniversarySheetOpen, setIsAnniversarySheetOpen] = useState(false)

  const openNicknameSheet = () => setIsNicknameSheetOpen(true)
  const setNicknameSheetOpen = (open: boolean) => setIsNicknameSheetOpen(open)

  const openAnniversarySheet = () => setIsAnniversarySheetOpen(true)
  const setAnniversarySheetOpen = (open: boolean) => setIsAnniversarySheetOpen(open)

  return {
    // 닉네임 관련
    isNicknameSheetOpen,
    openNicknameSheet,
    setNicknameSheetOpen,

    // 디데이 관련
    isAnniversarySheetOpen,
    openAnniversarySheet,
    setAnniversarySheetOpen,
  }
}
