import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { z } from 'zod'

import { useQuestionModal } from '@/features/question/hooks/use-question-modal'
import { QuestionHeader } from '@/features/question/ui/question-header'
import CustomTextarea from '@/features/question/ui/text-area'
import { wrapWithTracking } from '@/shared/analytics'
import { BUTTON_NAMES, CATEGORIES } from '@/shared/analytics/constants'
import { Screen } from '@/shared/layout/screen'
import questionService from '@/shared/services/question.service'
import { Button } from '@/shared/ui'
import { DetailHeaderBar } from '@/shared/ui/header-bar'

const searchSchema = z.object({
  coupleQuestionId: z.number(),
  isEdit: z.boolean().optional(),
})

export const Route = createFileRoute('/question/write-answer/')({
  component: RouteComponent,
  validateSearch: searchSchema,
})

function RouteComponent() {
  const { coupleQuestionId, isEdit = false } = Route.useSearch()

  const { data } = useQuery(questionService.questionDetailQuery(coupleQuestionId))

  const historyModal = useQuestionModal()
  const [answer, setAnswer] = useState(data?.me?.answer || '')
  const MAX_LENGTH = 100

  const handleSave = wrapWithTracking(BUTTON_NAMES.SAVE_ANSWER, CATEGORIES.QUESTION, () =>
    historyModal.saveQuestionModal(answer, isEdit)
  )

  const handleBack = wrapWithTracking(BUTTON_NAMES.BACK_WRITE, CATEGORIES.QUESTION, () =>
    historyModal.exitQuestionModal()
  )

  return (
    <Screen>
      <Screen.Header behavior="overlay">
        <DetailHeaderBar title="답변 작성" className="border-b border-gray-iron-100" onBackClick={handleBack} />
      </Screen.Header>

      <Screen.Content className="flex flex-1 flex-col bg-white pb-[var(--safe-bottom)]">
        <QuestionHeader data={data} />

        <CustomTextarea value={answer} onChange={(e) => setAnswer(e.target.value)} maxLength={MAX_LENGTH} />

        <div className="mt-auto p-5">
          <Button text="저장하기" onClick={handleSave} disabled={!answer.trim()} />
        </div>
      </Screen.Content>
    </Screen>
  )
}
