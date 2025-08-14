import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { z } from 'zod'

import { useQuestionModal } from '@/features/question/hooks/use-question-modal'
import { QuestionHeader } from '@/features/question/ui/question-header'
import CustomTextarea from '@/features/question/ui/text-area'
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
  loaderDeps: (search) => search,
  loader: async ({ context, deps }) => {
    const { coupleQuestionId } = deps.search

    await context.queryClient.ensureQueryData(questionService.questionDetailQuery(coupleQuestionId))

    return { coupleQuestionId, isEdit: deps.search.isEdit || false }
  },
})

function RouteComponent() {
  const { coupleQuestionId, isEdit } = Route.useLoaderData()

  const { data } = useQuery(questionService.questionDetailQuery(coupleQuestionId))

  const historyModal = useQuestionModal()
  const [answer, setAnswer] = useState(data?.me?.answer || '')
  const MAX_LENGTH = 100

  const handleSave = () => {
    historyModal.saveQuestionModal(answer, isEdit)
  }

  return (
    <div className="flex h-full flex-col pb-[var(--safe-bottom)]">
      <DetailHeaderBar
        title="답변 작성"
        className="border-b-[1px] border-gray-iron-100"
        onBackClick={() => historyModal.exitQuestionModal()}
      />

      <QuestionHeader data={data} />

      <CustomTextarea value={answer} onChange={(e) => setAnswer(e.target.value)} maxLength={MAX_LENGTH} />

      <div className="p-5">
        <Button text="저장하기" onClick={handleSave} disabled={!answer.trim()} />
      </div>
    </div>
  )
}
