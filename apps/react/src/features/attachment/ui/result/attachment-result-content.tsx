import { useNavigate } from '@tanstack/react-router'
import { X } from 'lucide-react'

import ConflictIcon from '@/assets/icons/conflict.svg'
import EmotionIcon from '@/assets/icons/emotion.svg'
import RelationshipIcon from '@/assets/icons/relationship.svg'
import { ATTACHMENT_TYPE_DATA } from '@/features/attachment/models/attachment-data'
import { ResultAttitudeSection } from '@/features/attachment/ui/result/result-attitude-section'
import { ResultDetailBox } from '@/features/attachment/ui/result/result-detail-box'
import { ResultScoreBox } from '@/features/attachment/ui/result/result-score-box'
import { wrapWithTracking } from '@/shared/analytics'
import { BUTTON_NAMES, CATEGORIES } from '@/shared/analytics/constants'
import { Button } from '@/shared/ui'
import { DetailHeaderBar } from '@/shared/ui/header-bar'

interface UserInfo {
  nickname?: string
  loveTypeCategory?: string
  anxietyRate?: number
  avoidanceRate?: number
}

interface AttachmentResultContentProps {
  userInfo: UserInfo | null | undefined
  type: 'my' | 'partner'
}

export function AttachmentResultContent({ userInfo, type }: AttachmentResultContentProps) {
  const navigate = useNavigate()
  const isMyResult = type === 'my'

  // 결과 데이터 확인
  if (!userInfo?.loveTypeCategory) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-white">
        <div className="text-center">
          <p className="mb-4 text-gray-iron-600">
            {isMyResult ? '애착 검사 결과를 찾을 수 없습니다.' : '파트너의 검사 결과를 찾을 수 없습니다.'}
          </p>
          <Button
            text="홈으로 이동"
            onClick={wrapWithTracking(BUTTON_NAMES.GO_HOME_FROM_RESULT, CATEGORIES.ATTACHMENT, () =>
              navigate({ to: '/' })
            )}
          />
        </div>
      </div>
    )
  }

  const attachmentData = ATTACHMENT_TYPE_DATA[userInfo.loveTypeCategory as keyof typeof ATTACHMENT_TYPE_DATA]

  if (!attachmentData) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-white">
        <div className="text-center">
          <p className="mb-4 text-red-500">애착 유형 데이터를 찾을 수 없습니다.</p>
          <Button
            text="홈으로 이동"
            onClick={wrapWithTracking(BUTTON_NAMES.GO_HOME_FROM_RESULT, CATEGORIES.ATTACHMENT, () =>
              navigate({ to: '/' })
            )}
          />
        </div>
      </div>
    )
  }

  const handleClose = () => {
    navigate({ to: '/', resetScroll: true })
  }

  return (
    <div className="flex h-full w-full flex-col bg-white pt-[50px]">
      {/* 헤더 네비게이션 */}
      <DetailHeaderBar
        showBackButton={false}
        right={
          <button onClick={handleClose}>
            <X className="h-6 w-6 text-gray-iron-950" />
          </button>
        }
        className="fixed top-[var(--safe-top)]"
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
          <h1 className="heading1-semibold text-gray-iron-950">
            {isMyResult
              ? `${userInfo.nickname || '사용자'}님의 애착유형은`
              : `${userInfo.nickname || '연인'}님의 애착유형은`}
          </h1>
          <h2 className="title2-bold" style={{ color: attachmentData.color }}>
            {attachmentData.character}
          </h2>
        </div>
      </div>

      {/* 결과 정보 섹션 */}
      <div className="mt-[52px] px-[20px]">
        {/* 점수 박스 */}
        <ResultScoreBox anxietyRate={userInfo.anxietyRate || 0} avoidanceRate={userInfo.avoidanceRate || 0} />

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
          title="갈등 해결 태도"
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
      <div className="px-5 pb-[calc(var(--safe-bottom)_+_20px)]">
        <Button
          text="홈으로 이동하기"
          onClick={wrapWithTracking(BUTTON_NAMES.GO_HOME_FROM_RESULT, CATEGORIES.ATTACHMENT, handleClose)}
        />
      </div>
    </div>
  )
}
