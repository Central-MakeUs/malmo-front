import { createFileRoute } from '@tanstack/react-router'
import malmoLogo from '@/assets/images/malmo-logo.png'
import HeartIcon from '@/assets/icons/heart.svg'

import { BottomNavigation } from '@/shared/ui/bottom-navigation'
import { useAuth } from '@/features/auth'
import { calculateDDay } from '@/shared/utils/date'
import { ChatEntryCard } from '@/features/chat/components/chat-entry-card'
import { useChatRoomStatusQuery } from '@/features/chat/hook/use-chat-queries'
import { AttachmentTestBanner } from '@/features/attachment/ui/attachment-test-banner'
import { TodayQuestionSection, useTodayQuestion } from '@/features/question'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  const { userInfo } = useAuth()

  const { data: todayQuestion } = useTodayQuestion()

  // D-day 계산
  const dDay = calculateDDay(userInfo.startLoveDate)

  // 채팅방 상태 확인
  const chatRoomStatus = useChatRoomStatusQuery()
  const isChatActive = chatRoomStatus.data === 'ALIVE'

  // 애착유형이 있는지 확인
  const hasAttachmentType = !!userInfo.loveTypeCategory

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <header className="flex h-[60px] items-center justify-between px-5">
        <img src={malmoLogo} alt="말모 로고" className="h-8 w-[94px]" />

        {/* D-day */}
        <div className="flex h-8 items-center rounded-[30px] border border-gray-iron-200 px-4 py-[5px]">
          <HeartIcon className="h-4 w-4" />
          <span className="body3-medium ml-[9px] text-gray-iron-950">D+{dDay}</span>
        </div>
      </header>

      {/* 메인 컨텐츠  */}
      <div className="mt-3 px-5">
        {/* 연애 고민 상담 섹션 */}
        <ChatEntryCard isChatActive={isChatActive} />

        {/* 애착유형 테스트 섹션 */}
        {!hasAttachmentType && <AttachmentTestBanner />}

        {/* 오늘의 마음 질문 섹션 */}
        <TodayQuestionSection todayQuestion={todayQuestion} />
      </div>

      {/* 하단 네비게이션 */}
      <BottomNavigation />
    </div>
  )
}
