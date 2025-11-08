import { useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Pen, X } from 'lucide-react'
import { useState } from 'react'
import { z } from 'zod'

import MyHeart from '@/assets/icons/my-heart.svg'
import OtherHeart from '@/assets/icons/other-heart.svg'
import { QuestionHeader } from '@/features/question/ui/question-header'
import { wrapWithTracking } from '@/shared/analytics'
import { BUTTON_NAMES, CATEGORIES } from '@/shared/analytics/constants'
import bridge from '@/shared/bridge'
import { Screen } from '@/shared/layout/screen'
import { cn } from '@/shared/lib/cn'
import questionService from '@/shared/services/question.service'
import { DetailHeaderBar } from '@/shared/ui/header-bar'
import { PageLoadingFallback } from '@/shared/ui/loading-fallback'

const searchSchema = z.object({
  coupleQuestionId: z.number(),
})

export const Route = createFileRoute('/question/see-answer/')({
  component: RouteComponent,
  validateSearch: searchSchema,
})

function RouteComponent() {
  const { coupleQuestionId } = Route.useSearch()
  const [showHelp, setShowHelp] = useState(false)
  const queryClient = useQueryClient()

  const { data: showHelpInit, isLoading: isHelpLoading } = useQuery({
    queryKey: ['question-help'],
    queryFn: () => bridge.getQuestionHelp(),
  })

  const shouldShowHelp = showHelpInit && !showHelp

  const { data, isLoading, error } = useQuery(questionService.questionDetailQuery(coupleQuestionId))

  if (isHelpLoading || isLoading) {
    return <PageLoadingFallback />
  }

  if (error || !data) return null

  return (
    <Screen>
      <Screen.Header behavior="overlay">
        <DetailHeaderBar title="답변 보기" className="border-b border-gray-iron-100" />
      </Screen.Header>

      <Screen.Content className="flex flex-1 flex-col bg-white">
        <QuestionHeader data={data} />

        <div className="mb-15 px-5">
          <div className="mb-3 flex justify-between">
            <div className="flex items-center gap-2">
              <MyHeart className="h-6 w-6" />
              <p className="body1-semibold">{data?.me?.nickname}</p>
            </div>

            <div className="relative">
              <div
                className={cn(
                  'absolute top-[-72px] right-0 rounded-[12px] bg-gray-iron-900 py-2.5 pr-[10px] pl-4 whitespace-nowrap',
                  "before:absolute before:right-[18px] before:bottom-[-4.5px] before:h-3 before:w-3 before:-translate-x-1/2 before:rotate-45 before:rounded-sm before:bg-inherit before:content-['']",
                  { hidden: !shouldShowHelp || !data?.me?.updatable }
                )}
                onClick={wrapWithTracking(BUTTON_NAMES.CLOSE_TOOLTIP, CATEGORIES.QUESTION, async () => {
                  await bridge.setQuestionHelpFalse()
                  setShowHelp(true)
                  queryClient.invalidateQueries({ queryKey: ['question-help'] })
                })}
              >
                <div className="flex gap-[2px] text-gray-iron-200">
                  <p className="label1-medium">
                    두 사람 모두 작성이 끝난 후
                    <br />
                    하루가 지나면 수정이 어려워요
                  </p>
                  <X className="h-4 w-4" />
                </div>
              </div>

              <Link
                className="flex items-center gap-1 text-gray-iron-500"
                to="/question/write-answer"
                disabled={!data?.me?.updatable}
                hidden={!data?.me?.updatable}
                search={{ coupleQuestionId, isEdit: true }}
                onClick={wrapWithTracking(BUTTON_NAMES.EDIT_ANSWER, CATEGORIES.QUESTION, () => {})}
              >
                <Pen className="h-4 w-4" />
                <p className="body4-medium">수정하기</p>
              </Link>
            </div>
          </div>

          <div className="rounded-[10px] bg-gray-neutral-100 px-5 py-4">
            <p className="body2-reading-regular whitespace-pre-line text-gray-iron-900">{data?.me?.answer}</p>
          </div>
        </div>

        <div className="px-5">
          <div className="mb-3 flex justify-between">
            <div className="flex items-center gap-2">
              <OtherHeart className="h-6 w-6" />
              <p className="body1-semibold">{data?.partner?.nickname ?? '연인'}</p>
            </div>
          </div>

          <div className="rounded-[10px] bg-gray-neutral-100 px-5 py-4">
            <p
              className={cn('body2-reading-regular whitespace-pre-line text-gray-iron-900', {
                'text-gray-iron-500': !data?.partner || !data?.partner?.answer,
              })}
            >
              {data?.partner === null
                ? `아직 커플 연동을 하지 않았어요!\n연동하면 마음질문 답변을 기반으로 성향을 기억해,\n더 정확한 상담을 할 수 있어요.`
                : data?.partner?.answer || '아직 답변을 작성하지 않았어요!'}
            </p>
          </div>
        </div>
      </Screen.Content>
    </Screen>
  )
}
