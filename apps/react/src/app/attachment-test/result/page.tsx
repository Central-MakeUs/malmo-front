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
  const { loveTypeData, attachmentData, loading, error, handleClose, handleComplete, retryLoad } = useAttachmentResult()

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
  if (error || !loveTypeData || !attachmentData) {
    // TODO: 에러 처리 필요
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-red-500">{error || '데이터를 불러올 수 없습니다.'}</p>
          <Button text="다시 시도" onClick={retryLoad} className="mt-4" />
        </div>
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
        <ResultScoreBox loveTypeData={loveTypeData} />

        {/* 상세 정보 박스 */}
        <ResultDetailBox attachmentData={attachmentData} />
      </div>

      {/* 결과 태도 섹션 */}
      <div className="mt-[52px] px-[20px]">
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
        <div className="mb-[80px]">
          <ResultAttitudeSection
            icon={EmotionIcon}
            title="정서적인 표현"
            color={attachmentData.color}
            items={attachmentData.emotionalExpressions}
          />
        </div>
      </div>

      {/* 바텀 버튼 */}
      <div className="mt-[80px] px-[20px] pb-[20px]">
        <Button text="완료" onClick={handleComplete} />
      </div>
    </div>
  )
}
