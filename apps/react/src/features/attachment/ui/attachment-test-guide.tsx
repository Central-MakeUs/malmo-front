import CheckIcon from '@/assets/icons/check.svg'
import StarIcon from '@/assets/icons/star.svg'
import { Button } from '@/shared/ui'

interface AttachmentTestGuideProps {
  isOpen: boolean
  onClose: () => void
}

export function AttachmentTestGuide({ isOpen, onClose }: AttachmentTestGuideProps) {
  if (!isOpen) return null

  const guideItems = [
    '애착유형은 고정된 성격이 아닌 현재 관계 성향을 알려줘요',
    '나쁜 유형은 없어요! 최대한 솔직하게 응답해 주세요',
    '나와 비슷한 선택지를 가볍게 골라 주세요',
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      {/* 배경 오버레이 */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* 바텀 시트 */}
      <div className="animate-in slide-in-from-bottom relative h-[476px] w-full rounded-t-[20px] bg-white duration-300">
        {/* 상단 40px 간격 */}
        <div className="h-10" />

        {/* 컨텐츠 영역 */}
        <div className="px-5">
          <div className="mb-3 flex justify-center">
            <StarIcon className="h-[32px] w-[32px]" />
          </div>

          {/* 제목 */}
          <div className="heading1-bold mb-7 text-center">
            <span className="text-malmo-rasberry-500">잠깐!</span>
            <span className="text-gray-iron-950">
              {' '}
              시작하기 전에 <br /> 3가지를 확인해 주세요.
            </span>
          </div>

          {/* 컨테이너 */}
          <div className="space-y-3">
            {guideItems.map((item, index) => (
              <div key={index} className="flex h-fit gap-1 rounded-[10px] bg-gray-neutral-100 px-3 py-2">
                <CheckIcon className="h-5 w-5 text-gray-iron-500" />
                <p className="text-body3-medium text-gray-iron-800">{item}</p>
              </div>
            ))}
          </div>

          {/* 확인하기 버튼 */}
          <div className="mt-7">
            <Button text="네, 확인했어요!" onClick={onClose} />
          </div>
        </div>
      </div>
    </div>
  )
}
