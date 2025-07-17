import { useState, useEffect, useRef, RefObject } from 'react'

export interface AnniversaryState {
  selectedDate: Date
  visibleYear: number
  visibleMonth: number
  visibleDay: number
  years: number[]
  months: number[]
  days: number[]
  yearRef: RefObject<HTMLDivElement>
  monthRef: RefObject<HTMLDivElement>
  dayRef: RefObject<HTMLDivElement>
}

export interface AnniversaryActions {
  handleYearScroll: () => void
  handleMonthScroll: () => void
  handleDayScroll: () => void
  handleDateChange: (type: 'year' | 'month' | 'day', value: number) => void
  handleSelectDate: () => Date | undefined
  setSelectedDate: (date: Date) => void
}

export function useAnniversary(initialDate: Date | null = null) {
  // 현재 날짜 (오늘)
  const today = new Date()
  const currentYear = today.getFullYear()
  const currentMonth = today.getMonth() + 1
  const currentDay = today.getDate()

  // 초기 날짜 설정 (제공된 날짜 또는 오늘)
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate || today)
  const [visibleYear, setVisibleYear] = useState<number>(selectedDate.getFullYear())
  const [visibleMonth, setVisibleMonth] = useState<number>(selectedDate.getMonth() + 1)
  const [visibleDay, setVisibleDay] = useState<number>(selectedDate.getDate())

  // 타입 단언을 사용하여 RefObject<HTMLDivElement>로 명시적 타입 지정
  const yearRef = useRef<HTMLDivElement>(null) as RefObject<HTMLDivElement>
  const monthRef = useRef<HTMLDivElement>(null) as RefObject<HTMLDivElement>
  const dayRef = useRef<HTMLDivElement>(null) as RefObject<HTMLDivElement>

  // 년도 범위 (현재 년도 기준 -10년 ~ 현재)
  const years = Array.from({ length: 11 }, (_, i) => currentYear - 10 + i)

  // 월 (1-12, 현재 년도인 경우 현재 월까지만)
  const getAvailableMonths = () => {
    if (visibleYear === currentYear) {
      return Array.from({ length: currentMonth }, (_, i) => i + 1)
    }
    return Array.from({ length: 12 }, (_, i) => i + 1)
  }

  const months = getAvailableMonths()

  // 해당 월의 일수 계산
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate()
  }

  // 일 (1-31, 현재 년도 및 월인 경우 현재 일까지만)
  const getAvailableDays = () => {
    const daysInMonth = getDaysInMonth(visibleYear, visibleMonth)
    const maxDays = visibleYear === currentYear && visibleMonth === currentMonth ? currentDay : daysInMonth

    return Array.from({ length: maxDays }, (_, i) => i + 1)
  }

  const days = getAvailableDays()

  // 날짜가 현재 날짜보다 미래인지 확인
  const isFutureDate = (year: number, month: number, day: number) => {
    if (year > currentYear) return true
    if (year === currentYear && month > currentMonth) return true
    if (year === currentYear && month === currentMonth && day > currentDay) return true
    return false
  }

  // 스크롤 위치 설정 함수
  const scrollToSelected = () => {
    if (yearRef.current) {
      const yearIndex = years.findIndex((y) => y === selectedDate.getFullYear())
      if (yearIndex !== -1) {
        yearRef.current.scrollTop = yearIndex * 50
      }
    }

    if (monthRef.current) {
      const monthIndex = months.findIndex((m) => m === selectedDate.getMonth() + 1)
      if (monthIndex !== -1) {
        monthRef.current.scrollTop = monthIndex * 50
      }
    }

    if (dayRef.current) {
      const dayIndex = days.findIndex((d) => d === selectedDate.getDate())
      if (dayIndex !== -1) {
        dayRef.current.scrollTop = dayIndex * 50
      }
    }
  }

  // 초기 스크롤 위치 설정
  useEffect(() => {
    scrollToSelected()
    setVisibleYear(selectedDate.getFullYear())
    setVisibleMonth(selectedDate.getMonth() + 1)
    setVisibleDay(selectedDate.getDate())
  }, [selectedDate])

  // 년도 변경 시 월과 일 업데이트
  useEffect(() => {
    // 현재 년도인 경우 선택된 월이 현재 월보다 크면 현재 월로 조정
    if (visibleYear === currentYear && visibleMonth > currentMonth) {
      setVisibleMonth(currentMonth)
    }

    // 현재 년도 및 월인 경우 선택된 일이 현재 일보다 크면 현재 일로 조정
    if (visibleYear === currentYear && visibleMonth === currentMonth && visibleDay > currentDay) {
      setVisibleDay(currentDay)
    }
  }, [visibleYear])

  // 월 변경 시 일 업데이트
  useEffect(() => {
    // 현재 년도 및 월인 경우 선택된 일이 현재 일보다 크면 현재 일로 조정
    if (visibleYear === currentYear && visibleMonth === currentMonth && visibleDay > currentDay) {
      setVisibleDay(currentDay)
    } else {
      // 선택된 월의 최대 일수보다 선택된 일이 크면 최대 일수로 조정
      const maxDays = getDaysInMonth(visibleYear, visibleMonth)
      if (visibleDay > maxDays) {
        setVisibleDay(maxDays)
      }
    }
  }, [visibleMonth])

  // 스크롤 이벤트 핸들러
  const handleYearScroll = () => {
    if (!yearRef.current) return

    const itemHeight = 50
    const scrollTop = yearRef.current.scrollTop
    const index = Math.round(scrollTop / itemHeight)

    if (index >= 0 && index < years.length) {
      const year = years[index]
      if (year !== undefined) {
        setVisibleYear(year)
      }
    }
  }

  const handleMonthScroll = () => {
    if (!monthRef.current) return

    const itemHeight = 50
    const scrollTop = monthRef.current.scrollTop
    const index = Math.round(scrollTop / itemHeight)

    if (index >= 0 && index < months.length) {
      const month = months[index]
      if (month !== undefined) {
        setVisibleMonth(month)
      }
    }
  }

  const handleDayScroll = () => {
    if (!dayRef.current) return

    const itemHeight = 50
    const scrollTop = dayRef.current.scrollTop
    const index = Math.round(scrollTop / itemHeight)

    if (index >= 0 && index < days.length) {
      const day = days[index]
      if (day !== undefined) {
        setVisibleDay(day)
      }
    }
  }

  // 날짜 변경 핸들러
  const handleDateChange = (type: 'year' | 'month' | 'day', value: number) => {
    const newDate = new Date(selectedDate)

    if (type === 'year') {
      newDate.setFullYear(value)
      setVisibleYear(value)

      // 현재 년도로 변경 시 월과 일 조정
      if (value === currentYear) {
        if (newDate.getMonth() + 1 > currentMonth) {
          newDate.setMonth(currentMonth - 1)
          setVisibleMonth(currentMonth)
        }

        if (newDate.getMonth() + 1 === currentMonth && newDate.getDate() > currentDay) {
          newDate.setDate(currentDay)
          setVisibleDay(currentDay)
        }
      }
    } else if (type === 'month') {
      newDate.setMonth(value - 1)
      setVisibleMonth(value)

      // 현재 년도 및 월로 변경 시 일 조정
      if (newDate.getFullYear() === currentYear && value === currentMonth && newDate.getDate() > currentDay) {
        newDate.setDate(currentDay)
        setVisibleDay(currentDay)
      }

      // 선택된 월의 최대 일수보다 선택된 일이 크면 최대 일수로 조정
      const maxDays = getDaysInMonth(newDate.getFullYear(), value)
      if (newDate.getDate() > maxDays) {
        newDate.setDate(maxDays)
        setVisibleDay(maxDays)
      }
    } else if (type === 'day') {
      newDate.setDate(value)
      setVisibleDay(value)
    }

    // 미래 날짜인 경우 현재 날짜로 설정
    if (isFutureDate(newDate.getFullYear(), newDate.getMonth() + 1, newDate.getDate())) {
      setSelectedDate(today)
      return
    }

    setSelectedDate(newDate)
  }

  // 선택 확인 핸들러
  const handleSelectDate = () => {
    const newDate = new Date(selectedDate)
    newDate.setFullYear(visibleYear)
    newDate.setMonth(visibleMonth - 1)
    newDate.setDate(visibleDay)

    // 미래 날짜인 경우 현재 날짜로 설정
    if (isFutureDate(visibleYear, visibleMonth, visibleDay)) {
      setSelectedDate(today)
      return today
    }

    setSelectedDate(newDate)
    return newDate
  }

  return {
    state: {
      selectedDate,
      visibleYear,
      visibleMonth,
      visibleDay,
      years,
      months,
      days,
      yearRef,
      monthRef,
      dayRef,
    },
    actions: {
      handleYearScroll,
      handleMonthScroll,
      handleDayScroll,
      handleDateChange,
      handleSelectDate,
      setSelectedDate,
    },
  }
}
