import { X } from 'lucide-react'
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Sheet, SheetContent, SheetTitle } from '@/shared/ui/sheet'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import coupleService from '@/shared/services/couple.service'
import { useAuth } from '@/features/auth'
import { useAlertDialog } from '@/shared/hook/alert-dialog.hook'
import bridge from '@/shared/bridge'
import { useBridge } from '@webview-bridge/react'

interface PartnerCodeSheetProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
  onCoupleConnected?: () => void // 커플 연결 성공시 호출할 핸들러
}

export function PartnerCodeSheet({ isOpen, onOpenChange, onSuccess, onCoupleConnected }: PartnerCodeSheetProps) {
  const keyboardHeight = useBridge(bridge.store, (state) => state.keyboardHeight)
  const [partnerCode, setPartnerCode] = useState('')
  const { refreshUserInfo } = useAuth()
  const { open } = useAlertDialog()

  const connectCoupleMutation = useMutation({
    ...coupleService.connectCoupleMutation(),
    onSuccess: async () => {
      // 사용자 정보 새로고침
      await refreshUserInfo()

      // 성공시 시트 닫기
      bridge.toggleOverlay(0)
      onOpenChange(false)

      // 커플 연결 성공 핸들러 호출
      onCoupleConnected?.()

      // 성공 콜백 호출
      onSuccess?.()

      // 입력값 초기화
      setPartnerCode('')
    },
  })

  const handleSubmit = () => {
    if (!partnerCode.trim() || connectCoupleMutation.isPending) return
    connectCoupleMutation.mutate(partnerCode.trim())
  }

  const handleClose = () => {
    setPartnerCode('')
    bridge.toggleOverlay(0)
    onOpenChange(false)
  }

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent
        side="bottom"
        className="rounded-t-[20px] border-none p-0 [&>*:last-child]:hidden"
        style={{
          bottom: keyboardHeight ?? 0,
          transition: keyboardHeight && keyboardHeight > 0 ? 'bottom 250ms cubic-bezier(0.17,0.59,0.4,0.77)' : 'none',
        }}
      >
        {/* 접근성을 위한 숨겨진 제목 */}
        <SheetTitle className="sr-only">상대방 코드로 연결하기</SheetTitle>

        {/* 커스텀 X 버튼 */}
        <button onClick={handleClose} className="absolute top-4 right-5 z-10 flex h-6 w-6 items-center justify-center">
          <X className="h-6 w-6 text-gray-iron-950" />
        </button>

        <div className="flex h-full flex-col px-5 pt-10">
          {/* 제목 */}
          <h2 className="heading1-bold text-center text-gray-iron-950">상대방 코드로 연결하기</h2>

          {/* 설명 */}
          <p className="body1-medium mt-1 text-center text-gray-iron-700">
            <span className="text-malmo-rasberry-500"> 연인에게 받은 코드</span>를 입력해주세요
          </p>

          {/* 코드 입력 */}
          <div className="mt-7">
            <Input
              type="text"
              value={partnerCode}
              onChange={(e) => setPartnerCode(e.target.value)}
              placeholder="코드를 입력해 주세요"
            />
          </div>

          {/* 연결하기 버튼 */}
          <div className="mt-12 mb-5">
            <Button
              text={'연결하기'}
              onClick={handleSubmit}
              disabled={!partnerCode.trim() || connectCoupleMutation.isPending}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
