import { DetailHeaderBar } from '@/shared/components/header-bar'
import CustomTextarea from '@/features/question/ui/text-area'
import { Badge, Button } from '@/shared/ui'
import { createFileRoute } from '@tanstack/react-router'
import { useQuestionModal } from '@/features/question/hooks/use-question-modal'
import { useState } from 'react'
import { z } from 'zod'
import questionService from '@/shared/services/question.service'

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

    const data = await questionService.fetchQuestionDetail(coupleQuestionId)
    return { data: data?.data, isEdit: deps.search.isEdit || false }
  },
})

function RouteComponent() {
  const { data, isEdit } = Route.useLoaderData()

  const historyModal = useQuestionModal()
  const [answer, setAnswer] = useState('')
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
        <Badge variant="rasberry" className="mx-5 mt-6 mb-2">
          1번째 마음 질문
        </Badge>
        <p className="heading1-bold mb-3 pr-15 pl-6 break-keep">내가 가장 사랑받는다고 느끼는 순간은 언제였나요?</p>
        <p className="body4-medium mb-8 pl-6 text-gray-iron-500">2025년 07월 19일</p>

        <hr className="mx-5 mb-5 h-1 rounded-[1px] border-gray-iron-200" />

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
