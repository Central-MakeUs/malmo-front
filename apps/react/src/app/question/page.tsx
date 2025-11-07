import { useQueryClient } from '@tanstack/react-query'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { z } from 'zod'

// internal imports
import { TodayQuestionSection } from '@/features/question'
import { useTodayQuestion } from '@/features/question/hooks/use-today-question'
import CalendarItem from '@/features/question/ui/calendar-item'
import { wrapWithTracking } from '@/shared/analytics'
import { BUTTON_NAMES, CATEGORIES } from '@/shared/analytics/constants'
import { Screen } from '@/shared/layout/screen'
import { cn } from '@/shared/lib/cn'
import questionService from '@/shared/services/question.service'
import { Badge, BottomNavigation } from '@/shared/ui'
import { HomeHeaderBar } from '@/shared/ui/header-bar'
import { PageLoadingFallback } from '@/shared/ui/loading-fallback'

export const Route = createFileRoute('/question/')({
  component: RouteComponent,
  validateSearch: z.object({
    selectedLevel: z.number().optional(),
  }),
})

function RouteComponent() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { data, isLoading, error } = useTodayQuestion({ refetchOnMount: true })
  const search = Route.useSearch()

  if (isLoading) {
    return <PageLoadingFallback />
  }

  if (error || !data || data.level === undefined) return null

  const initialLevel = search.selectedLevel ?? data.level
  const [currentLevel, setCurrentLevel] = useState(Math.floor((initialLevel - 1) / 30))
  const [selectedQuestion, setSelectedQuestion] = useState(data)

  // 선택한 질문 포커스
  useEffect(() => {
    const levelFromSearch = search.selectedLevel
    if (!data || !data.level) return

    const targetLevel = levelFromSearch ?? data.level
    setCurrentLevel(Math.floor((targetLevel - 1) / 30))

    if (targetLevel < data.level) {
      // 과거 질문인 경우 API 캐시에서 가져와 선택
      queryClient
        .ensureQueryData(questionService.pastQuestionQuery(targetLevel))
        .then((question) => setSelectedQuestion({ ...question }))
        .catch(() => setSelectedQuestion({ ...data }))
    } else {
      // 오늘 질문 또는 미래인 경우 최신으로 설정
      setSelectedQuestion({ ...data })
    }
  }, [search.selectedLevel, data, queryClient])

  const maxPage = Math.floor((data.level - 1) / 30)

  return (
    <Screen>
      <Screen.Header>
        <HomeHeaderBar title="마음도감" />
      </Screen.Header>

      <Screen.Content className="has-bottom-nav no-bounce-scroll flex-1 bg-gray-neutral-100">
        <div className="bg-white pt-3 pb-7">
          <div className="mb-4 flex items-center justify-between pr-5 pl-[14px]">
            <div className="flex items-center gap-1 py-[2px]">
              <ChevronLeft
                className={cn('h-5 w-5 text-gray-iron-950', { 'text-gray-iron-300': currentLevel === 0 })}
                onClick={wrapWithTracking(BUTTON_NAMES.PREV_CALENDAR, CATEGORIES.QUESTION, () => {
                  if (currentLevel > 0) {
                    setCurrentLevel((prev) => prev - 1)
                  }
                })}
              />
              <p className="body1-semibold">도감 {currentLevel + 1}페이지</p>
              <ChevronRight
                className={cn('h-5 w-5 text-gray-iron-950', { 'text-gray-iron-300': currentLevel >= maxPage })}
                onClick={wrapWithTracking(BUTTON_NAMES.NEXT_CALENDAR, CATEGORIES.QUESTION, () => {
                  if (currentLevel < maxPage) {
                    setCurrentLevel((prev) => prev + 1)
                  }
                })}
              />
            </div>

            <Badge variant="black">
              모은 마음 {data.meAnswered && data.partnerAnswered ? data.level : data.level - 1}개
            </Badge>
          </div>

          <div className="mx-auto grid h-[340px] w-[335px] grid-cols-6 grid-rows-5 place-items-center gap-1">
            {Array.from({ length: 30 }, (_, i) => {
              const itemLevel = currentLevel * 30 + i + 1
              return (
                <div
                  key={i}
                  onClick={wrapWithTracking(BUTTON_NAMES.SELECT_DATE, CATEGORIES.QUESTION, async () => {
                    if (data.level! > itemLevel) {
                      const question = await queryClient.ensureQueryData(questionService.pastQuestionQuery(itemLevel))
                      setSelectedQuestion({ ...question })
                      // 포커스 유지
                      navigate({
                        to: '/question',
                        replace: true,
                        search: (prev) => ({ ...prev, selectedLevel: itemLevel }),
                      })
                    } else if (data.level! === itemLevel) {
                      setSelectedQuestion({ ...data })
                      navigate({
                        to: '/question',
                        replace: true,
                        search: (prev) => ({ ...prev, selectedLevel: itemLevel }),
                      })
                    }
                  })}
                >
                  <CalendarItem
                    props={{
                      className: cn('h-7 w-7', {
                        // 1) 둘 다 답변했거나, 과거 날짜
                        'text-malmo-rasberry-500': (data.meAnswered && data.partnerAnswered) || data.level! > itemLevel,

                        // 2) 한명만 답변했을 때
                        'text-malmo-rasberry-100':
                          (data.meAnswered || data.partnerAnswered) &&
                          !(data.meAnswered && data.partnerAnswered) &&
                          data.level! === itemLevel,

                        // 3) 둘 다 안 했고, 오늘 날짜일 때
                        'text-gray-neutral-300': !data.meAnswered && !data.partnerAnswered && data.level! === itemLevel,

                        // 4) 미래 날짜
                        'text-gray-neutral-100': itemLevel > data.level!,
                      }),
                    }}
                    date={itemLevel.toString()}
                    selected={selectedQuestion?.level === itemLevel}
                  />
                </div>
              )
            })}
          </div>
        </div>

        <div className="px-5 py-5">
          <Link
            to={selectedQuestion.meAnswered ? '/question/see-answer' : '/question/write-answer'}
            search={{ coupleQuestionId: selectedQuestion?.coupleQuestionId || 0, isEdit: false }}
            onClick={wrapWithTracking(
              selectedQuestion.meAnswered ? BUTTON_NAMES.VIEW_ANSWER : BUTTON_NAMES.WRITE_ANSWER,
              CATEGORIES.QUESTION,
              () => {}
            )}
          >
            <TodayQuestionSection todayQuestion={selectedQuestion} level={selectedQuestion.level} />
          </Link>
        </div>
      </Screen.Content>

      <BottomNavigation />
    </Screen>
  )
}
