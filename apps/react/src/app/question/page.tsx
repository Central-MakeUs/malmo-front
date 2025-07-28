import { TodayQuestionSection } from '@/features/question'
import CalendarItem from '@/features/question/ui/calendar-item'
import { HomeHeaderBar } from '@/shared/components/header-bar'
import { Badge, BottomNavigation } from '@/shared/ui'
import { createFileRoute } from '@tanstack/react-router'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export const Route = createFileRoute('/question/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex h-screen flex-col bg-gray-neutral-100 pb-[60px]">
      <HomeHeaderBar title="마음도감" />

      <section className="overflow-y-auto">
        <div className="bg-white pt-3 pb-7">
          <div className="mb-4 flex items-center justify-between pr-5 pl-[14px]">
            <div className="flex items-center gap-1 py-[2px]">
              <ChevronLeft className="h-5 w-5 text-gray-iron-300" />
              <p className="body1-semibold">도감 1페이지</p>
              <ChevronRight className="h-5 w-5 text-gray-iron-300" />
            </div>

            <Badge variant="black">모은 마음 29개</Badge>
          </div>

          <div className="mx-auto grid h-[340px] w-[335px] grid-cols-6 grid-rows-5 place-items-center gap-1">
            {Array.from({ length: 30 }, (_, i) => (
              <CalendarItem
                key={i}
                props={{ className: 'h-7 w-7 text-malmo-rasberry-500' }}
                date={(i + 1).toString()}
                selected={false}
              />
            ))}
          </div>
        </div>

        <div className="flex-1 px-5 pb-6">
          <TodayQuestionSection path="/question/answer" />
        </div>
      </section>

      <BottomNavigation />
    </div>
  )
}
