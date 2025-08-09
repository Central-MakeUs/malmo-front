import { X } from 'lucide-react'
import { Sheet, SheetContent, SheetTitle } from '@/shared/ui/sheet'
import { Button } from '@/shared/ui/button'
import { NicknameInput } from './nickname-input'
import { useNicknameInput } from '../hooks/use-nickname-input'
import { useMutation } from '@tanstack/react-query'
import memberService from '@/shared/services/member.service'
import { useAuth } from '@/features/auth'
import bridge from '@/shared/bridge'
import { useBridge } from '@webview-bridge/react'

interface NicknameEditSheetProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function NicknameEditSheet({ isOpen, onOpenChange }: NicknameEditSheetProps) {
  const { nickname, handleNicknameChange, clearNickname, isValid, maxLength } = useNicknameInput()
  const { refreshUserInfo } = useAuth()
  const keyboardHeight = useBridge(bridge.store, (state) => state.keyboardHeight)
  const serviceOptions = memberService.updateMemberMutation()
  const updateNicknameMutation = useMutation({
    ...serviceOptions,
    onSuccess: async () => {
      serviceOptions.onSuccess?.()
      clearNickname()
      // 사용자 정보 새로고침
      await refreshUserInfo()
      // 성공시 시트 닫기
      onOpenChange(false)
    },
  })

  const handleSubmit = () => {
    if (!isValid || updateNicknameMutation.isPending) return
    updateNicknameMutation.mutate({ nickname })
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="rounded-t-[20px] border-none p-0 [&>*:last-child]:hidden"
        style={{
          bottom: keyboardHeight ?? 0,
          transition: keyboardHeight && keyboardHeight > 0 ? 'bottom 250ms cubic-bezier(0.17,0.59,0.4,0.77)' : 'none',
        }}
      >
        {/* 접근성을 위한 숨겨진 제목 */}
        <SheetTitle className="sr-only">닉네임 변경</SheetTitle>

        {/* 커스텀 X 버튼 */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-5 z-10 flex h-6 w-6 items-center justify-center"
        >
          <X className="h-6 w-6 text-gray-iron-950" />
        </button>

        <div className="flex h-full flex-col px-5 pt-10">
          {/* 제목 */}
          <h2 className="heading1-bold text-center text-gray-iron-950">닉네임 변경</h2>

          {/* 설명 */}
          <p className="body1-medium mt-1 text-center text-gray-iron-700">
            <span className="text-malmo-rasberry-500">새로 사용할 닉네임</span>을 입력해주세요
          </p>

          {/* 닉네임 입력 */}
          <div className="mt-7">
            <NicknameInput value={nickname} onChange={handleNicknameChange} maxLength={maxLength} />
          </div>

          {/* 변경하기 버튼 */}
          <div className="mt-12 mb-5">
            <Button text={'변경하기'} onClick={handleSubmit} disabled={!isValid || updateNicknameMutation.isPending} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
