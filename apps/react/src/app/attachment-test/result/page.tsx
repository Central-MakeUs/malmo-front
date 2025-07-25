import { createFileRoute } from '@tanstack/react-router'
import { DetailHeaderBar } from '@/shared/components/header-bar'
import { Button } from '@/shared/ui'
import { X } from 'lucide-react'
import RelationshipIcon from '@/assets/icons/relationship.svg'
import ConflictIcon from '@/assets/icons/conflict.svg'
import EmotionIcon from '@/assets/icons/emotion.svg'
import { useAuth } from '@/features/auth'
import { useAttachmentResult, ResultScoreBox, ResultDetailBox, ResultAttitudeSection } from '@/features/attachment'

export const Route = createFileRoute('/attachment-test/result/')({
  component: AttachmentTestResultPage,
})

function AttachmentTestResultPage() {
  const { userInfo } = useAuth()
  const { loveTypeCategory, anxietyRate, avoidanceRate, attachmentData, loading, error, handleClose, handleComplete } =
    useAttachmentResult()

  // 로딩 상태
  if (loading) {
    // TODO: 로딩 관리 필요
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white">
        <p>결과를 불러오는 중...</p>
      </div>
    )
  }

  // 에러 상태
  if (error || !loveTypeCategory || !attachmentData) {
    // TODO: 에러 처리 필요
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white">
        <p>에러가 발생했습니다.</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-white">
      {/* 헤더 네비게이션 */}
      <DetailHeaderBar
        showBackButton={false}
        right={
          <button onClick={handleClose}>
            <X className="h-6 w-6 text-gray-iron-950" />
          </button>
        }
      />

      {/* 캐릭터 정보 섹션 */}
      <div className="mt-[4px] flex flex-col items-center px-[20px]">
        {/* 캐릭터 이미지 */}
        <img
          src={attachmentData.characterImage}
          alt={attachmentData.character}
          className="h-[240px] w-[260px] object-contain"
        />

        {/* 애착유형 텍스트 */}
        <div className="mt-[10px] text-center">
          <h1 className="heading1-semibold text-gray-iron-950">{userInfo.nickname || '사용자'}님의 애착유형은</h1>
          <h2
            className="title2-bold"
            style={{
              color: attachmentData.color,
            }}
          >
            {attachmentData.character}
          </h2>
        </div>
      </div>

      {/* 결과 정보 섹션 */}
      <div className="mt-[52px] px-[20px]">
        {/* 점수 박스 */}
        <ResultScoreBox anxietyRate={anxietyRate} avoidanceRate={avoidanceRate} />

        {/* 상세 정보 박스 */}
        <ResultDetailBox attachmentData={attachmentData} />
      </div>

      {/* 결과 태도 섹션 */}
      <div className="mt-[52px] mb-[80px] px-[20px]">
        {/* 관계에 대한 태도 */}
        <ResultAttitudeSection
          icon={RelationshipIcon}
          title="관계에 대한 태도"
          color={attachmentData.color}
          items={attachmentData.relationshipAttitudes}
        />

        {/* 갈등해결 태도 */}
        <ResultAttitudeSection
          icon={ConflictIcon}
          title="갈등해결 태도"
          color="#1B1B1B"
          items={attachmentData.conflictSolvingAttitudes}
        />

        {/* 정서적인 표현 */}
        <ResultAttitudeSection
          icon={EmotionIcon}
          title="정서적인 표현"
          color={attachmentData.color}
          items={attachmentData.emotionalExpressions}
        />
      </div>

      {/* 바텀 버튼 */}
      <div className="px-[20px] pb-[20px]">
        <Button text="완료" onClick={handleComplete} />
      </div>
    </div>
  )
}
