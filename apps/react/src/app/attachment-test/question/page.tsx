import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

import {
  useAttachmentQuestions,
  QuestionProgress,
  QuestionList,
  SubmissionLoading,
  AttachmentTestGuide,
  QUESTION_CONFIG,
} from '@/features/attachment'
import { useAuth } from '@/features/auth'
import bridge from '@/shared/bridge'
import loveTypeService from '@/shared/services/love-type.service'
import { Button } from '@/shared/ui'
import { DetailHeaderBar } from '@/shared/ui/header-bar'

export const Route = createFileRoute('/attachment-test/question/')({
  component: AttachmentTestQuestionPage,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(loveTypeService.questionsQuery())
  },
})

function AttachmentTestQuestionPage() {
  const [isGuideOpen, setIsGuideOpen] = useState(true)
  const { userInfo } = useAuth()
  const {
    loading,
    error,
    currentPage,
    totalPages,
    currentQuestions,
    answers,
    isCurrentPageComplete,
    isSubmitting,
    handleGoBack,
    handleNext,
    handleSelectAnswer,
    setQuestionRef,
  } = useAttachmentQuestions()

  // 로딩 페이지 렌더링
  if (isSubmitting) {
    return <SubmissionLoading nickname={userInfo.nickname || '사용자'} />
  }

  return (
    <div className="flex h-screen w-full flex-col bg-white">
      {/* 헤더 */}
      <DetailHeaderBar onBackClick={handleGoBack} />

      {/* 진행 상태 표시 */}
      <QuestionProgress
        currentPage={currentPage}
        totalPages={totalPages}
        questionsPerPage={QUESTION_CONFIG.QUESTIONS_PER_PAGE}
      />

      {/* 구분선 */}
      <hr className="mx-[20px] mt-[40px] mb-[16px] h-[1px] border-0 bg-gray-iron-200" />

      {/* 질문 목록 */}
      <div className="flex-1 overflow-y-auto">
        <QuestionList
          questions={currentQuestions}
          answers={answers}
          onSelectAnswer={handleSelectAnswer}
          setQuestionRef={setQuestionRef}
          loading={loading}
          error={error}
        />
      </div>

      {/* 다음 버튼 */}
      <div className="mt-auto mb-10 px-5">
        <Button
          text={currentPage === totalPages ? '완료 하기' : '다음'}
          onClick={handleNext}
          disabled={loading || !isCurrentPageComplete}
        />
      </div>

      {/* 애착유형 검사 가이드 바텀 시트 */}
      <AttachmentTestGuide
        isOpen={isGuideOpen}
        onClose={() => {
          bridge.toggleOverlay(0)
          setIsGuideOpen(false)
        }}
      />
    </div>
  )
}
