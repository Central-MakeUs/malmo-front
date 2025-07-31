import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogAction,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/components/alert-dialog'
import { Button } from '@/shared/ui/button'
import MomoConnectedImage from '@/assets/images/momo-connected.png'

interface CoupleConnectedModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function CoupleConnectedModal({ isOpen, onOpenChange }: CoupleConnectedModalProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-[320px] rounded-[20px] p-0">
        {/* 접근성을 위한 숨겨진 제목 */}
        <AlertDialogHeader className="sr-only">
          <AlertDialogTitle>커플 연결 완료</AlertDialogTitle>
        </AlertDialogHeader>

        <div className="flex flex-col items-center px-6 py-6">
          {/* 이미지 */}
          <div className="mt-9">
            <img src={MomoConnectedImage} alt="연결 완료" className="h-[164px] w-[184px]" />
          </div>

          {/* 텍스트 */}
          <div className="mt-6 text-center">
            <h2 className="heading1-bold text-gray-iron-950">커플 연결이 완료되었어요!</h2>
            <p className="body1-medium mt-2 text-gray-iron-700">이제 말모를 제한 없이 사용할 수 있어요!</p>
          </div>

          {/* 확인 버튼 */}
          <div className="mt-8 w-full">
            <AlertDialogAction asChild>
              <Button text="확인" onClick={() => onOpenChange(false)} />
            </AlertDialogAction>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
