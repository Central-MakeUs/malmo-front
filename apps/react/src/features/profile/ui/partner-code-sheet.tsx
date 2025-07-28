import { X } from 'lucide-react'
import { useState } from 'react'
import { Sheet, SheetContent, SheetTitle } from '@ui/common/components/sheet'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import coupleService from '@/shared/services/couple.service'
import { useAuth } from '@/features/auth'
import { useAlertDialog } from '@/shared/hook/alert-dialog.hook'
import { CoupleConnectedModal } from './couple-connected-modal'

interface PartnerCodeSheetProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function PartnerCodeSheet({ isOpen, onOpenChange }: PartnerCodeSheetProps) {
  const [partnerCode, setPartnerCode] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const { refreshUserInfo } = useAuth()
  const { open } = useAlertDialog()

  const handleSubmit = async () => {
    if (!partnerCode.trim() || isSubmitting) return

    try {
      setIsSubmitting(true)

      // 커플 연결 API 호출
      await coupleService.connectCouple(partnerCode.trim())

      // 사용자 정보 새로고침
      await refreshUserInfo()

      // 성공시 시트 닫기
      onOpenChange(false)

      // 성공 모달 표시
      setShowSuccessModal(true)

      // 입력값 초기화
      setPartnerCode('')
    } catch (error: any) {
      open({
        title: '연결 실패',
        description: '유효하지 않은 코드입니다. 다시 확인해주세요.',
        confirmText: '확인',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setPartnerCode('')
    onOpenChange(false)
  }

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent side="bottom" className="!h-[354px] rounded-t-[20px] border-none p-0 [&>*:last-child]:hidden">
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
          <div className="mt-auto mb-5">
            <Button text={'연결하기'} onClick={handleSubmit} disabled={!partnerCode.trim() || isSubmitting} />
          </div>
        </div>
      </SheetContent>

      {/* 커플 연결 완료 모달 */}
      <CoupleConnectedModal isOpen={showSuccessModal} onOpenChange={setShowSuccessModal} />
    </Sheet>
  )
}
