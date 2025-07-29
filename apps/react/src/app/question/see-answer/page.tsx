import { DetailHeaderBar } from '@/shared/components/header-bar'
import { Badge } from '@/shared/ui'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Pen } from 'lucide-react'
import MyHeart from '@/assets/icons/my-heart.svg'
import OtherHeart from '@/assets/icons/other-heart.svg'
import { z } from 'zod'
import questionService from '@/shared/services/question.service'
import { formatDate } from '@/shared/utils'
import { cn } from '@ui/common/lib/utils'

const searchSchema = z.object({
  coupleQuestionId: z.number(),
})

export const Route = createFileRoute('/question/see-answer/')({
  component: RouteComponent,
  validateSearch: searchSchema,
  loaderDeps: (search) => search,
  loader: async ({ context, deps }) => {
    const { coupleQuestionId } = deps.search

    const data = await questionService.fetchQuestionDetail(coupleQuestionId)
    return { data: data?.data || null, coupleQuestionId }
  },
})

function RouteComponent() {
  const { data, coupleQuestionId } = Route.useLoaderData()

  return (
    <div className="flex h-screen flex-col">
      <DetailHeaderBar title="답변 보기" className="border-b-[1px] border-gray-iron-100" />

      <div className="flex-1">
        <Badge variant="rasberry" className="mx-5 mt-6 mb-2">
          {data?.level}번째 마음 질문
        </Badge>
        <p className="heading1-bold mb-3 pr-15 pl-6 break-keep">{data?.content}</p>
        <p className="body4-medium mb-8 pl-6 text-gray-iron-500">{formatDate(data?.createdAt, 'YYYY년 MM월 DD일')}</p>

        <hr className="mx-5 mb-5 h-1 rounded-[1px] border-gray-iron-200" />

        <div className="mb-15 px-5">
          <div className="mb-3 flex justify-between">
            <div className="flex items-center gap-2">
              <MyHeart className="h-6 w-6" />
              <p className="body1-semibold">{data?.me?.nickname}</p>
            </div>

            <Link
              className="flex items-center gap-1 text-gray-iron-500"
              to="/question/write-answer"
              disabled={!data?.me?.updatable}
              search={{ coupleQuestionId, isEdit: true }}
            >
              <Pen className="h-4 w-4" />
              <p className="body4-medium">수정하기</p>
            </Link>
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
