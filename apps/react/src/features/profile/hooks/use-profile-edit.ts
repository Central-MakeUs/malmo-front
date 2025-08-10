import { useState } from 'react'

import bridge from '@/shared/bridge'

export function useProfileEdit() {
  const [isNicknameSheetOpen, setIsNicknameSheetOpen] = useState(false)
  const [isAnniversarySheetOpen, setIsAnniversarySheetOpen] = useState(false)

  const openNicknameSheet = () => {
    bridge.toggleOverlay(3)
    setIsNicknameSheetOpen(true)
  }
  const setNicknameSheetOpen = (open: boolean) => {
    bridge.toggleOverlay(open ? 3 : 0)
    setIsNicknameSheetOpen(open)
  }

  const openAnniversarySheet = () => {
    bridge.toggleOverlay(3)
    setIsAnniversarySheetOpen(true)
  }
  const setAnniversarySheetOpen = (open: boolean) => {
    bridge.toggleOverlay(open ? 3 : 0)
    setIsAnniversarySheetOpen(open)
  }

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
