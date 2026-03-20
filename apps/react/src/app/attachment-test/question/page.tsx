import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import z from 'zod'

import {
  useAttachmentQuestions,
  QuestionProgress,
  QuestionList,
  SubmissionLoading,
  AttachmentTestGuide,
  QUESTION_CONFIG,
} from '@/features/attachment'
import { useAuth } from '@/features/auth'
import { usePersonalityFlow } from '@/features/profile/lib/personality-flow'
import { wrapWithTracking } from '@/shared/analytics'
import { BUTTON_NAMES, CATEGORIES } from '@/shared/analytics/constants'
import { Screen } from '@/shared/layout/screen'
import { Button } from '@/shared/ui'
import { DetailHeaderBar } from '@/shared/ui/header-bar'

const searchSchema = z.object({
  from: z.string().optional(),
  flow: z.enum(['my-personality', 'partner-personality', 'chat-entry']).optional(),
  chatId: z.number().optional(),
})

export const Route = createFileRoute('/attachment-test/question/')({
  component: AttachmentTestQuestionPage,
  validateSearch: searchSchema,
})

function AttachmentTestQuestionPage() {
  const [isGuideOpen, setIsGuideOpen] = useState(true)
  const { userInfo } = useAuth()
  const { from, flow, next } = usePersonalityFlow()

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
  } = useAttachmentQuestions({ from, onComplete: flow ? () => next() : undefined })

  // 트래킹이 적용된 핸들러들
  const handleGoBackWithTracking = wrapWithTracking(BUTTON_NAMES.BACK_TEST, CATEGORIES.ATTACHMENT, handleGoBack)

  const handleNextWithTracking = wrapWithTracking(
    currentPage === totalPages ? BUTTON_NAMES.COMPLETE_TEST : BUTTON_NAMES.NEXT_QUESTION,
    CATEGORIES.ATTACHMENT,
    handleNext
  )

  const handleSelectAnswerWithTracking = wrapWithTracking(
    (_questionId: number, score: number) => {
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

  if (isSubmitting) {
    return <SubmissionLoading nickname={userInfo.nickname || '사용자'} />
  }

  return (
    <Screen>
      <Screen.Header behavior="overlay">
        <DetailHeaderBar onBackClick={handleGoBackWithTracking} />
      </Screen.Header>

      <Screen.Content className="flex flex-1 flex-col bg-white pb-[var(--safe-bottom)]">
        <QuestionProgress
          currentPage={currentPage}
          totalPages={totalPages}
          questionsPerPage={QUESTION_CONFIG.QUESTIONS_PER_PAGE}
        />

        <hr className="mx-[20px] mt-[40px] mb-[16px] h-[1px] border-0 bg-gray-iron-200" />

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

        <div className="mt-auto mb-5 px-5">
          <Button
            text={currentPage === totalPages ? '완료하기' : '다음'}
            onClick={handleNextWithTracking}
            disabled={loading || !isCurrentPageComplete}
          />
        </div>
      </Screen.Content>

      <AttachmentTestGuide isOpen={isGuideOpen} onClose={handleCloseGuide} />
    </Screen>
  )
}
