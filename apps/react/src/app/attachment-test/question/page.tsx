import { createFileRoute } from '@tanstack/react-router'
import { Button, HeaderNavigation } from '@/shared/ui'
import { useAttachmentQuestions, QuestionProgress, QuestionList, QUESTION_CONFIG } from '@/features/attachment'

export const Route = createFileRoute('/attachment-test/question/')({
  component: AttachmentTestQuestionPage,
})

function AttachmentTestQuestionPage() {
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
    // TODO: 로딩 관리 필요
  }

  return (
    <div className="flex h-screen w-full flex-col bg-white">
      {/* 헤더 */}
      <HeaderNavigation onBack={handleGoBack} />

      {/* 진행 상태 표시 */}
      <QuestionProgress
        currentPage={currentPage}
        totalPages={totalPages}
        questionsPerPage={QUESTION_CONFIG.QUESTIONS_PER_PAGE}
      />

      {/* 구분선 */}
      <div className="mt-[40px] mb-[16px] h-[1px] w-full bg-gray-iron-200"></div>

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
    </div>
  )
}
