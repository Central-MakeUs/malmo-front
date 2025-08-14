import { useMutation } from '@tanstack/react-query'
import { X } from 'lucide-react'

import { useAuth } from '@/features/auth'
import { useKeyboardSheetMotion } from '@/shared/hooks/use-keyboard-motion'
import memberService from '@/shared/services/member.service'
import { Button } from '@/shared/ui/button'
import { Sheet, SheetContent, SheetTitle } from '@/shared/ui/sheet'

import { NicknameInput } from './nickname-input'
import { useNicknameInput } from '../hooks/use-nickname-input'

export function NicknameEditSheet({ isOpen, onOpenChange }: { isOpen: boolean; onOpenChange: (o: boolean) => void }) {
  const { nickname, handleNicknameChange, clearNickname, isValid, maxLength } = useNicknameInput()
  const { refreshUserInfo } = useAuth()
  const serviceOptions = memberService.updateMemberMutation()
  const updateNicknameMutation = useMutation({
    ...serviceOptions,
    onSuccess: async () => {
      serviceOptions.onSuccess?.()
      clearNickname()
      await refreshUserInfo()
      onOpenChange(false)
    },
  })

  const { motionStyle } = useKeyboardSheetMotion()

  const handleSubmit = () => {
    if (!isValid || updateNicknameMutation.isPending) return
    updateNicknameMutation.mutate({ nickname })
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="rounded-t-[20px] border-none p-0 [&>*:last-child]:hidden"
        style={motionStyle}
      >
        <SheetTitle className="sr-only">닉네임 변경</SheetTitle>

        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-5 z-10 flex h-6 w-6 items-center justify-center"
          aria-label="닫기"
        >
          <X className="h-6 w-6 text-gray-iron-950" />
        </button>

        <div className="flex h-full flex-col px-5 pt-10">
          <h2 className="heading1-bold text-center text-gray-iron-950">닉네임 변경</h2>
          <p className="body1-medium mt-1 text-center text-gray-iron-700">
            <span className="text-malmo-rasberry-500">새로 사용할 닉네임</span>을 입력해주세요
          </p>

          <div className="mt-7">
            <NicknameInput value={nickname} onChange={handleNicknameChange} maxLength={maxLength} />
          </div>

          <div className="mt-12 mb-5">
            <Button text="변경하기" onClick={handleSubmit} disabled={!isValid || updateNicknameMutation.isPending} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
