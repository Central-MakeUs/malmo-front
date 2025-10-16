import { useMutation } from '@tanstack/react-query'
import { X } from 'lucide-react'
import { useMemo, useEffect, useState } from 'react'

import { DatePicker, useAnniversary } from '@/features/anniversary'
import { useAuth } from '@/features/auth'
import memberService from '@/shared/services/member.service'
import { Button } from '@/shared/ui/button'
import { Sheet, SheetContent, SheetTitle } from '@/shared/ui/sheet'

interface AnniversaryEditSheetProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSave?: () => void
}

export function AnniversaryEditSheet({ isOpen, onOpenChange, onSave }: AnniversaryEditSheetProps) {
  const { userInfo, refreshUserInfo } = useAuth()

  // startLoveDate가 있으면 Date 객체로 변환해서 초기값으로 사용
  const initialDate = useMemo(() => {
    return userInfo.startLoveDate ? new Date(userInfo.startLoveDate) : null
  }, [userInfo.startLoveDate])
  const anniversary = useAnniversary(initialDate)

  // 날짜 변경 여부 추적
  const [hasChanged, setHasChanged] = useState(false)

  const serviceOptions = memberService.updateStartDateMutation()
  const updateStartDateMutation = useMutation({
    ...serviceOptions,
    onSuccess: async () => {
      serviceOptions.onSuccess?.()
      // 사용자 정보 새로고침
      await refreshUserInfo()
      // 성공시 시트 닫기
      onOpenChange(false)
    },
  })

  // 바텀시트가 열릴 때마다 초기 날짜로 리셋
  useEffect(() => {
    if (isOpen) {
      anniversary.actions.resetToInitialDate()
      setHasChanged(false) // 변경 상태도 리셋
    }
  }, [isOpen])

  // 날짜 변경 감지
  useEffect(() => {
    if (!isOpen || !initialDate) return

    const { visibleYear, visibleMonth, visibleDay } = anniversary.state
    const initialYear = initialDate.getFullYear()
    const initialMonth = initialDate.getMonth() + 1
    const initialDay = initialDate.getDate()

    const isChanged = visibleYear !== initialYear || visibleMonth !== initialMonth || visibleDay !== initialDay

    if (isChanged && !hasChanged) {
      setHasChanged(true)
    }
  }, [
    anniversary.state.visibleYear,
    anniversary.state.visibleMonth,
    anniversary.state.visibleDay,
    initialDate,
    hasChanged,
    isOpen,
  ])

  const handleSubmit = () => {
    if (updateStartDateMutation.isPending) return

    // 선택된 날짜 가져오기
    const selectedDate = anniversary.actions.handleSelectDate()
    if (!selectedDate) return

    // 날짜를 YYYY-MM-DD 형식으로 변환
    const startLoveDate = selectedDate.toISOString().split('T')[0]
    if (!startLoveDate) return

    onSave?.()
    updateStartDateMutation.mutate({ startLoveDate })
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[466px] rounded-t-[20px] border-none p-0 [&>*:last-child]:hidden">
        {/* 접근성을 위한 숨겨진 제목 */}
        <SheetTitle className="sr-only">디데이 변경</SheetTitle>

        {/* 커스텀 X 버튼 */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-5 z-10 flex h-6 w-6 items-center justify-center"
        >
          <X className="h-6 w-6 text-gray-iron-950" />
        </button>

        <div className="flex h-full flex-col px-5 pt-10">
          {/* 제목 */}
          <h2 className="heading1-bold text-center text-gray-iron-950">디데이 변경</h2>

          {/* 설명 */}
          <p className="body1-medium mt-1 text-center text-gray-iron-700">
            <span className="text-malmo-rasberry-500">두 사람이 만난 날짜</span>를 입력해 주세요
          </p>

          {/* 날짜 선택 컴포넌트 */}
          <div className="mt-12">
            <DatePicker state={anniversary.state} actions={anniversary.actions} />
          </div>

          {/* 변경하기 버튼 */}
          <div className="mt-auto mb-5">
            <Button
              text={'변경하기'}
              onClick={handleSubmit}
              disabled={!hasChanged || updateStartDateMutation.isPending}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
