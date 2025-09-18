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
import { wrapWithTracking } from '@/shared/analytics'
import { BUTTON_NAMES, CATEGORIES } from '@/shared/analytics/constants'
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

  // 트래킹이 적용된 핸들러들
  const handleGoBackWithTracking = wrapWithTracking(BUTTON_NAMES.BACK_TEST, CATEGORIES.ATTACHMENT, handleGoBack)

  const handleNextWithTracking = wrapWithTracking(
    currentPage === totalPages ? BUTTON_NAMES.COMPLETE_TEST : BUTTON_NAMES.NEXT_QUESTION,
    CATEGORIES.ATTACHMENT,
    handleNext
  )

  const handleSelectAnswerWithTracking = wrapWithTracking(
    (_questionId: number, score: number) => {
      // 선택한 옵션 번호에 따른 버튼 이름 결정 (1-5)
      const buttonNameMap = {
        1: BUTTON_NAMES.SELECT_OPTION_1,
        2: BUTTON_NAMES.SELECT_OPTION_2,
        3: BUTTON_NAMES.SELECT_OPTION_3,
        4: BUTTON_NAMES.SELECT_OPTION_4,
        5: BUTTON_NAMES.SELECT_OPTION_5,
      } as const

      return buttonNameMap[score as keyof typeof buttonNameMap]
    },
    CATEGORIES.ATTACHMENT,
    handleSelectAnswer
  )

  const handleCloseGuide = wrapWithTracking(BUTTON_NAMES.CLOSE_GUIDE, CATEGORIES.ATTACHMENT, () =>
    setIsGuideOpen(false)
  )

  // 로딩 페이지 렌더링
  if (isSubmitting) {
    return <SubmissionLoading nickname={userInfo.nickname || '사용자'} />
  }

  return (
    <div className="flex h-[calc(100vh-var(--safe-top))] w-full flex-col bg-white">
      {/* 헤더 */}
      <DetailHeaderBar onBackClick={handleGoBackWithTracking} />

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
          onSelectAnswer={handleSelectAnswerWithTracking}
          setQuestionRef={setQuestionRef}
          loading={loading}
          error={error}
        />
      </div>

      {/* 다음 버튼 */}
      <div className="mt-auto mb-10 px-5">
        <Button
          text={currentPage === totalPages ? '완료하기' : '다음'}
          onClick={handleNextWithTracking}
          disabled={loading || !isCurrentPageComplete}
        />
      </div>

      {/* 애착유형 검사 가이드 바텀 시트 */}
      <AttachmentTestGuide isOpen={isGuideOpen} onClose={handleCloseGuide} />
    </div>
  )
}
