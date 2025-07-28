import { TodayQuestionSection, useTodayQuestion } from '@/features/question'
import CalendarItem from '@/features/question/ui/calendar-item'
import { HomeHeaderBar } from '@/shared/components/header-bar'
import questionService from '@/shared/services/question.service'
import { Badge, BottomNavigation } from '@/shared/ui'
import { createFileRoute, Link, useLoaderData } from '@tanstack/react-router'
import { cn } from '@ui/common/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/question/')({
  component: RouteComponent,
  loader: async ({ context }) => {
    const data = await questionService.fetchTodayQuestion()
    return data?.data || null
  },
})

function RouteComponent() {
  const data = Route.useLoaderData()
  if (!data || data.level === undefined) return null

  const [selectedQuestion, setSelectedQuestion] = useState(data)
  const [currentLevel, setCurrentLevel] = useState(Math.floor(data.level / 30))

  return (
    <div className="flex h-screen flex-col bg-gray-neutral-100 pb-[60px]">
      <HomeHeaderBar title="마음도감" />

      <section className="overflow-y-auto">
        <div className="bg-white pt-3 pb-7">
          <div className="mb-4 flex items-center justify-between pr-5 pl-[14px]">
            <div className="flex items-center gap-1 py-[2px]">
              <ChevronLeft
                className="h-5 w-5 text-gray-iron-300"
                onClick={() => {
                  if (currentLevel > 0) setCurrentLevel((prev) => prev - 1)
                }}
              />
              <p className="body1-semibold">도감 {currentLevel + 1}페이지</p>
              <ChevronRight
                className="h-5 w-5 text-gray-iron-300"
                onClick={() => setCurrentLevel((prev) => prev + 1)}
              />
            </div>

            <Badge variant="black">
              모은 마음 {data.meAnswered && data.partnerAnswered ? data.level : data.level - 1}개
            </Badge>
          </div>

          <div className="mx-auto grid h-[340px] w-[335px] grid-cols-6 grid-rows-5 place-items-center gap-1">
            {Array.from({ length: 30 }, (_, i) => (
              <div
                key={i}
                onClick={async () => {
                  if (data.level! > currentLevel * 30 + i + 1) {
                    const { data: question } = await questionService.fetchPastQuestion(currentLevel * 30 + i + 1)
                    setSelectedQuestion({ ...question })
                  }
                }}
              >
                <CalendarItem
                  props={{
                    className: cn('h-7 w-7', {
                      'text-malmo-rasberry-500':
                        (data.meAnswered && data.partnerAnswered) || data.level! >= currentLevel * 30 + i + 1,
                      'text-malmo-rasberry-100': !data.partnerAnswered,
                      'text-gray-neutral-300': !data.meAnswered,
                      'text-gray-neutral-100': data.level! < i + 1 || currentLevel * 30 + i + 1 > data.level!,
                    }),
                  }}
                  date={(currentLevel * 30 + i + 1).toString()}
                  selected={selectedQuestion?.level === currentLevel * 30 + i + 1}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 px-5 pb-6">
          <Link
            to={selectedQuestion.meAnswered ? '/question/see-answer' : '/question/write-answer'}
            search={{ coupleQuestionId: selectedQuestion?.coupleQuestionId || 0, isEdit: false }}
          >
            <TodayQuestionSection todayQuestion={selectedQuestion} level={data.level} />
          </Link>
        </div>
      </section>

      <BottomNavigation />
    </div>
  )
}
