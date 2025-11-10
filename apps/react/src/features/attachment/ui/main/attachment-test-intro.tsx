import TestStartImage from '@/assets/images/test-start.png'

interface AttachmentTestIntroProps {
  nickname: string
}

export function AttachmentTestIntro({ nickname }: AttachmentTestIntroProps) {
  return (
    <div className="bg-malmo-rasberry-25 pt-[50px]">
      {/* 테스트 시작 이미지 */}
      <div className="mt-[36px] flex justify-center overflow-hidden">
        <img src={TestStartImage} alt="애착유형 테스트 시작" className="w-[440px] object-cover" />
      </div>

      {/* 제목 및 설명 */}
      <div className="mt-[44px] pr-[32px] pl-[20px]">
        <h1 className="title2-bold break-keep text-gray-iron-950">{nickname}님의 애착유형을 검사할게요</h1>
        <p className="body3-medium mt-[8px] text-gray-iron-700">테스트를 진행하고 나의 애착유형을 확인해 보세요</p>
      </div>

      <div className="mt-[40px]" />
    </div>
  )
}
