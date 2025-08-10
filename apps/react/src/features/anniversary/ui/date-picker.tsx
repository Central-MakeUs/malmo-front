import React from 'react'

import { AnniversaryState, AnniversaryActions } from '../hooks/use-anniversary'

interface DatePickerProps {
  state: AnniversaryState
  actions: Pick<AnniversaryActions, 'handleYearScroll' | 'handleMonthScroll' | 'handleDayScroll' | 'handleDateChange'>
}

export function DatePicker({ state, actions }: DatePickerProps) {
  const { visibleYear, visibleMonth, visibleDay, years, months, days, yearRef, monthRef, dayRef } = state

  const { handleYearScroll, handleMonthScroll, handleDayScroll, handleDateChange } = actions

  return (
    <div className="relative h-[200px]">
      {/* 년도 선택 */}
      <div className="absolute top-0 left-0 h-full w-1/3">
        <div className="pointer-events-none absolute top-0 left-0 z-10 h-[75px] w-full bg-gradient-to-b from-white to-transparent"></div>
        <div className="pointer-events-none absolute bottom-0 left-0 z-10 h-[75px] w-full bg-gradient-to-t from-white to-transparent"></div>
        <div
          ref={yearRef}
          className="h-full snap-y snap-mandatory overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          onScroll={handleYearScroll}
        >
          <div className="py-[75px]">
            {years.map((y) => (
              <div
                key={y}
                className={`flex h-[50px] cursor-pointer snap-center items-center justify-center ${
                  y === visibleYear ? 'heading2-semibold text-gray-iron-950' : 'body2-regular text-gray-iron-500'
                }`}
                onClick={() => handleDateChange('year', y)}
              >
                {y}년
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 월 선택 */}
      <div className="absolute top-0 left-1/3 h-full w-1/3">
        <div className="pointer-events-none absolute top-0 left-0 z-10 h-[75px] w-full bg-gradient-to-b from-white to-transparent"></div>
        <div className="pointer-events-none absolute bottom-0 left-0 z-10 h-[75px] w-full bg-gradient-to-t from-white to-transparent"></div>
        <div
          ref={monthRef}
          className="h-full snap-y snap-mandatory overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          onScroll={handleMonthScroll}
        >
          <div className="py-[75px]">
            {months.map((m) => (
              <div
                key={m}
                className={`flex h-[50px] cursor-pointer snap-center items-center justify-center ${
                  m === visibleMonth ? 'heading2-semibold text-gray-iron-950' : 'body2-regular text-gray-iron-500'
                }`}
                onClick={() => handleDateChange('month', m)}
              >
                {m}월
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 일 선택 */}
      <div className="absolute top-0 right-0 h-full w-1/3">
        <div className="pointer-events-none absolute top-0 left-0 z-10 h-[75px] w-full bg-gradient-to-b from-white to-transparent"></div>
        <div className="pointer-events-none absolute bottom-0 left-0 z-10 h-[75px] w-full bg-gradient-to-t from-white to-transparent"></div>
        <div
          ref={dayRef}
          className="h-full snap-y snap-mandatory overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          onScroll={handleDayScroll}
        >
          <div className="py-[75px]">
            {days.map((d) => (
              <div
                key={d}
                className={`flex h-[50px] cursor-pointer snap-center items-center justify-center ${
                  d === visibleDay ? 'heading2-semibold text-gray-iron-950' : 'body2-regular text-gray-iron-500'
                }`}
                onClick={() => handleDateChange('day', d)}
              >
                {d}일
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 선택된 날짜 경계선 */}
      <div className="pointer-events-none absolute top-[75px] left-0 h-[50px] w-full rounded-lg border border-malmo-rasberry-500"></div>
    </div>
  )
}
