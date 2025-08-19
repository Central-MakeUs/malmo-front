import { useMutation } from '@tanstack/react-query'
import { X } from 'lucide-react'
import { useState } from 'react'

import { useAuth } from '@/features/auth'
import { useKeyboardSheetMotion } from '@/shared/hooks/use-keyboard-motion'
import coupleService from '@/shared/services/couple.service'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Sheet, SheetContent, SheetTitle } from '@/shared/ui/sheet'

interface PartnerCodeSheetProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
  onCoupleConnected?: () => void // 커플 연결 성공시 호출할 핸들러
}

export function PartnerCodeSheet({ isOpen, onOpenChange, onSuccess, onCoupleConnected }: PartnerCodeSheetProps) {
  const [partnerCode, setPartnerCode] = useState('')
  const { refreshUserInfo } = useAuth()

  const { motionKeyboardBottom } = useKeyboardSheetMotion()

  const connectCoupleMutation = useMutation({
    ...coupleService.connectCoupleMutation(),
    onSuccess: async () => {
      // 사용자 정보 새로고침
      await refreshUserInfo()

      // 성공시 시트 닫기
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
    onOpenChange(false)
  }

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent
        side="bottom"
        className="rounded-t-[20px] border-none p-0 [&>*:last-child]:hidden"
        style={motionKeyboardBottom}
      >
        {/* 접근성을 위한 숨겨진 제목 */}
        <SheetTitle className="sr-only">연인 코드로 연결하기</SheetTitle>

        {/* 커스텀 X 버튼 */}
        <button onClick={handleClose} className="absolute top-4 right-5 z-10 flex h-6 w-6 items-center justify-center">
          <X className="h-6 w-6 text-gray-iron-950" />
        </button>

        <div className="flex h-full flex-col px-5 pt-10">
          {/* 제목 */}
          <h2 className="heading1-bold text-center text-gray-iron-950">연인 코드로 연결하기</h2>

          {/* 설명 */}
          <p className="body1-medium mt-1 text-center text-gray-iron-700">
            <span className="text-malmo-rasberry-500"> 연인에게 받은 커플 코드</span>를 입력해주세요
          </p>

          {/* 코드 입력 */}
          <div className="mt-7">
            <Input
              type="text"
              value={partnerCode}
              onChange={(e) => setPartnerCode(e.target.value)}
              placeholder="코드를 입력해 주세요"
              maxLength={7}
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
