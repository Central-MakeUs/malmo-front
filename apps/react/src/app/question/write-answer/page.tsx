import { DetailHeaderBar } from '@/shared/components/header-bar'
import CustomTextarea from '@/features/question/ui/text-area'
import { Button } from '@/shared/ui'
import { createFileRoute } from '@tanstack/react-router'
import { useQuestionModal } from '@/features/question/hooks/use-question-modal'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'
import questionService from '@/shared/services/question.service'
import { QuestionHeader } from '@/features/question/ui/question-header'

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
    <div className="flex h-screen flex-col">
      <DetailHeaderBar
        title="답변 작성"
        className="border-b-[1px] border-gray-iron-100"
        onBackClick={() => historyModal.exitQuestionModal()}
      />

      <div className="flex-1">
        <QuestionHeader data={data} />

        <div className="w-full px-6">
          <CustomTextarea value={answer} onChange={(e) => setAnswer(e.target.value)} maxLength={MAX_LENGTH} />
        </div>
      </div>

      <div className="p-5">
        <Button text="저장하기" onClick={handleSave} disabled={!answer.trim()} />
      </div>
    </div>
  )
}
