import { createFileRoute, useLoaderData, redirect } from '@tanstack/react-router'
import { DetailHeaderBar } from '@/shared/components/header-bar'
import { Button } from '@/shared/ui'
import { X } from 'lucide-react'
import RelationshipIcon from '@/assets/icons/relationship.svg'
import ConflictIcon from '@/assets/icons/conflict.svg'
import EmotionIcon from '@/assets/icons/emotion.svg'
import { ResultScoreBox, ResultDetailBox, ResultAttitudeSection } from '@/features/attachment'
import { ATTACHMENT_TYPE_DATA } from '@/features/attachment/models/attachment-data'
import type { AttachmentTypeData } from '@/features/attachment/models/types'

// 로더 데이터 타입 정의
interface AttachmentResultLoaderData {
  nickname: string
  anxietyRate: number
  avoidanceRate: number
  attachmentData: AttachmentTypeData
}

export const Route = createFileRoute('/attachment-test/result/')({
  beforeLoad: async ({ context }) => {
    // 인증되지 않은 경우 로그인 페이지로 리다이렉트
    if (!context.auth?.authenticated) {
      throw redirect({
        to: '/login',
      })
    }
  },

  // 데이터 로더
  loader: async ({ context }) => {
    try {
      let userInfo = context.auth.userInfo

      // 애착 데이터가 없으면 새로고침해서 최신 데이터 가져오기
      if (!userInfo.loveTypeCategory) {
        const refreshedUserInfo = await context.auth.refreshUserInfo()
        userInfo = refreshedUserInfo || userInfo
      }

      const loveTypeCategory = userInfo.loveTypeCategory

      if (!loveTypeCategory) {
        throw new Error('애착 검사 결과를 찾을 수 없습니다.')
      }

      // 애착 유형 데이터 매핑
      const attachmentData = ATTACHMENT_TYPE_DATA[loveTypeCategory as keyof typeof ATTACHMENT_TYPE_DATA]
      if (!attachmentData) {
        throw new Error('애착 유형 데이터를 찾을 수 없습니다.')
      }

      return {
        nickname: userInfo.nickname,
        anxietyRate: userInfo.anxietyRate,
        avoidanceRate: userInfo.avoidanceRate,
        attachmentData,
      } satisfies AttachmentResultLoaderData
    } catch (error) {
      console.error('애착 결과 로드 실패:', error)
      throw error
    }
  },

  // 에러 컴포넌트
  errorComponent: ({ error }) => (
    <div className="flex h-screen w-full items-center justify-center bg-white">
      <div className="text-center">
        <p className="mb-4 text-red-500">{error.message || '데이터를 불러오는데 실패했습니다.'}</p>
        <Button text="다시 시도" onClick={() => window.location.reload()} />
      </div>
    </div>
  ),

  // 로딩 컴포넌트
  pendingComponent: () => (
    <div className="flex h-screen w-full items-center justify-center bg-white">
      <p>결과를 불러오는 중...</p>
    </div>
  ),

  component: AttachmentTestResultPage,
})

function AttachmentTestResultPage() {
  const { nickname, anxietyRate, avoidanceRate, attachmentData } = useLoaderData({
    from: '/attachment-test/result/',
  }) as AttachmentResultLoaderData

  const handleClose = () => {
    // 홈으로 이동
    window.location.href = '/'
  }

  const handleComplete = () => {
    // 홈으로 이동
    window.location.href = '/'
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
          <h1 className="heading1-semibold text-gray-iron-950">{nickname || '사용자'}님의 애착유형은</h1>
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
