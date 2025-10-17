import { useMutation } from '@tanstack/react-query'
import { X } from 'lucide-react'
import { useEffect, useState } from 'react'

import { useAuth } from '@/features/auth'
import { wrapWithTracking } from '@/shared/analytics'
import { BUTTON_NAMES, CATEGORIES } from '@/shared/analytics/constants'
import { useKeyboardSheetMotion } from '@/shared/hooks/use-keyboard-motion'
import memberService from '@/shared/services/member.service'
import { Button } from '@/shared/ui/button'
import { Sheet, SheetContent, SheetTitle } from '@/shared/ui/sheet'

import { NicknameInput } from './nickname-input'
import { useNicknameInput } from '../hooks/use-nickname-input'

export function NicknameEditSheet({
  isOpen,
  onOpenChange,
  onSave,
}: {
  isOpen: boolean
  onOpenChange: (o: boolean) => void
  onSave?: () => void
}) {
  const { nickname, handleNicknameChange, clearNickname, isValid, maxLength } = useNicknameInput()
  const { refreshUserInfo } = useAuth()

  // 키보드 반응 설정
  const { keyboardHeight } = useKeyboardSheetMotion({
    defaultDuration: 250,
    defaultCurve: 'keyboard',
  })

  // 키보드 높이에 따른 시트 스타일
  const sheetKeyboardStyle = {
    marginBottom: keyboardHeight ? `${keyboardHeight}px` : '0px',
    transition: 'margin-bottom 250ms cubic-bezier(0.17, 0.59, 0.4, 0.77)',
  }

  // 키보드와 함께 닫히는 로직
  const [pendingClose, setPendingClose] = useState(false)

  const requestClose = () => {
    // 활성화된 입력 요소 포커스 해제
    if (typeof document !== 'undefined') {
      ;(document.activeElement as HTMLElement | null)?.blur()
    }

    if (keyboardHeight > 0) {
      setPendingClose(true) // 키보드가 내려간 후 닫기
    } else {
      onOpenChange(false)
    }
  }

  // 키보드가 완전히 내려간 후 시트 닫기
  useEffect(() => {
    if (pendingClose && keyboardHeight === 0) {
      requestAnimationFrame(() => {
        onOpenChange(false)
        setPendingClose(false)
      })
    }
  }, [pendingClose, keyboardHeight, onOpenChange])

  const serviceOptions = memberService.updateMemberMutation()
  const updateNicknameMutation = useMutation({
    ...serviceOptions,
    onSuccess: async () => {
      serviceOptions.onSuccess?.()
      clearNickname()
      await refreshUserInfo()
      requestClose() // 키보드와 함께 자연스럽게 닫기
    },
  })

  const handleSubmit = wrapWithTracking(BUTTON_NAMES.SAVE_NICKNAME, CATEGORIES.PROFILE, () => {
    if (!isValid || updateNicknameMutation.isPending) return
    onSave?.()
    updateNicknameMutation.mutate({ nickname })
  })

  // 시트 닫기 요청 처리
  const handleOpenChange = (open: boolean) => {
    if (!open) requestClose()
    else onOpenChange(true)
  }

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent
        side="bottom"
        className="overflow-hidden rounded-t-[20px] border-none p-0 [&>*:last-child]:hidden"
        style={sheetKeyboardStyle}
      >
        <div className="relative h-full">
          <SheetTitle className="sr-only">닉네임 변경</SheetTitle>

          {/* 닫기 버튼 */}
          <button
            onClick={requestClose}
            className="absolute top-4 right-5 z-10 flex h-6 w-6 items-center justify-center"
            aria-label="닫기"
          >
            <X className="h-6 w-6 text-gray-iron-950" />
          </button>

          <div className="flex h-full flex-col px-5 pt-10">
            {/* 제목 */}
            <h2 className="heading1-bold text-center text-gray-iron-950">닉네임 변경</h2>

            {/* 설명 */}
            <p className="body1-medium mt-1 text-center text-gray-iron-700">
              <span className="text-malmo-rasberry-500">새로 사용할 닉네임</span>을 입력해 주세요
            </p>

            {/* 닉네임 입력 */}
            <div className="mt-7">
              <NicknameInput value={nickname} onChange={handleNicknameChange} maxLength={maxLength} />
            </div>

            {/* 변경 버튼 */}
            <div className="mt-12 mb-5">
              <Button text="변경하기" onClick={handleSubmit} disabled={!isValid || updateNicknameMutation.isPending} />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
