import { DetailHeaderBar } from '@/shared/components/header-bar'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Pen, X } from 'lucide-react'
import MyHeart from '@/assets/icons/my-heart.svg'
import OtherHeart from '@/assets/icons/other-heart.svg'
import { z } from 'zod'
import { useQuery } from '@tanstack/react-query'
import questionService from '@/shared/services/question.service'
import { cn } from '@/shared/libs/cn'
import { useState } from 'react'
import bridge from '@/shared/bridge'
import { QuestionHeader } from '@/features/question/ui/question-header'

const searchSchema = z.object({
  coupleQuestionId: z.number(),
})

export const Route = createFileRoute('/question/see-answer/')({
  component: RouteComponent,
  validateSearch: searchSchema,
  loaderDeps: (search) => search,
  loader: async ({ context, deps }) => {
    const { coupleQuestionId } = deps.search
    await context.queryClient.ensureQueryData(questionService.questionDetailQuery(coupleQuestionId))
    const showHelpInit = await bridge.getQuestionHelp()
    return { coupleQuestionId, showHelpInit }
  },
})

function RouteComponent() {
  const { coupleQuestionId, showHelpInit } = Route.useLoaderData()
  const [showHelp, setShowHelp] = useState(showHelpInit)

  const { data } = useQuery(questionService.questionDetailQuery(coupleQuestionId))

  return (
    <div className="flex h-screen flex-col">
      <DetailHeaderBar title="답변 보기" className="border-b-[1px] border-gray-iron-100" />

      <div className="flex-1">
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
                  { hidden: !showHelp || !data?.me?.updatable }
                )}
                onClick={async () => {
                  await bridge.setQuestionHelpFalse()
                  setShowHelp(false)
                }}
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
              >
                <Pen className="h-4 w-4" />
                <p className="body4-medium">수정하기</p>
              </Link>
            </div>
          </div>

          <div className="rounded-[10px] bg-gray-neutral-100 px-5 py-4">
            <p className="body20reading-regular text-gray-iron-900">{data?.me?.answer}</p>
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
              className={cn('body20reading-regular text-gray-iron-900', {
                'text-gray-iron-500': !data?.partner || !data?.partner?.answer,
              })}
            >
              {data?.partner ? (
                data?.partner?.answer || '아직 답변을 작성하지 않았어요!'
              ) : (
                <>
                  아직 커플 연동을 하지 않았어요! 마이페이지 <br /> 커플 연동 관리에서 연동이 가능해요.
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
