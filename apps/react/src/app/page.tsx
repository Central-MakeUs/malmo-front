import { ChatRoomStateDataChatRoomStateEnum, PartnerMemberDataMemberStateEnum } from '@data/user-api-axios/api'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

import HeartIcon from '@/assets/icons/heart.svg'
import malmoLogo from '@/assets/images/malmo-logo-small.png'
import { getAttachmentType } from '@/features/attachment'
import { AttachmentTestBanner } from '@/features/attachment/ui/attachment-test-banner'
import { AttachmentTypeCards } from '@/features/attachment/ui/attachment-type-cards'
import { useAuth } from '@/features/auth'
import { useChatRoomStatusQuery } from '@/features/chat/hooks/use-chat-queries'
import { ChatEntryCard } from '@/features/chat/ui/chat-entry-card'
import { usePartnerInfo } from '@/features/member'
import { useAppNotifications } from '@/features/notification'
import { TodayQuestionSection, useTodayQuestion } from '@/features/question'
import { wrapWithTracking } from '@/shared/analytics'
import { BUTTON_NAMES, CATEGORIES } from '@/shared/analytics/constants'
import chatService from '@/shared/services/chat.service'
import memberService from '@/shared/services/member.service'
import questionService from '@/shared/services/question.service'
import { BottomNavigation } from '@/shared/ui/bottom-navigation'
import { calculateDDay } from '@/shared/utils/date'

export const Route = createFileRoute('/')({
  component: HomePage,
  loader: async ({ context }) => {
    const loadPromises = [
      context.queryClient.ensureQueryData(questionService.todayQuestionQuery()),
      context.queryClient.ensureQueryData(memberService.partnerInfoQuery()),
      context.queryClient.ensureQueryData(chatService.chatRoomStatusQuery()),
    ]

    await Promise.allSettled(loadPromises)
  },
})

function HomePage() {
  const { userInfo } = useAuth()
  const navigate = useNavigate()

  // 알림 시스템 초기화
  useAppNotifications()

  const { data: todayQuestion } = useTodayQuestion()
  const { data: partnerInfo } = usePartnerInfo()

  // D-day 계산
  const dDay = calculateDDay(userInfo.startLoveDate)

  // 채팅방 상태 확인
  const { data: chatRoomStatus } = useChatRoomStatusQuery()
  const isChatActive =
    chatRoomStatus === ChatRoomStateDataChatRoomStateEnum.Alive ||
    chatRoomStatus === ChatRoomStateDataChatRoomStateEnum.Paused ||
    chatRoomStatus === ChatRoomStateDataChatRoomStateEnum.NeedNextQuestion

  // 애착유형이 있는지 확인
  const hasAttachmentType = !!userInfo.loveTypeCategory

  // 파트너 연동 상태 확인
  const isPartnerConnected = partnerInfo?.memberState === PartnerMemberDataMemberStateEnum.Alive

  const myAttachmentData = getAttachmentType(userInfo.loveTypeCategory)
  const partnerAttachmentData = getAttachmentType(partnerInfo?.loveTypeCategory)

  const myAttachmentType = myAttachmentData?.character
  const partnerAttachmentType = partnerAttachmentData?.character

  // 오늘의 질문 클릭 핸들러
  const handleTodayQuestionClick = wrapWithTracking(BUTTON_NAMES.OPEN_TODAY_QUESTION, CATEGORIES.MAIN, () => {
    if (!todayQuestion?.coupleQuestionId) return

    if (todayQuestion.meAnswered) {
      // 답변했으면 수정창으로
      navigate({
        to: '/question/see-answer',
        search: { coupleQuestionId: todayQuestion.coupleQuestionId },
      })
    } else {
      // 답변 전이면 작성창으로
      navigate({
        to: '/question/write-answer',
        search: { coupleQuestionId: todayQuestion.coupleQuestionId },
      })
    }
  })

  return (
    <div className="has-bottom-nav flex h-full flex-col bg-white pt-[60px]">
      {/* 헤더 */}
      <header className="fixed top-[var(--safe-top)] flex h-[60px] w-full items-center justify-between bg-white px-5">
        <img src={malmoLogo} alt="말모 로고" className="h-8 w-[94px]" />

        {/* D-day */}
        {isPartnerConnected && (
          <div className="flex h-8 items-center rounded-[30px] border border-gray-iron-200 px-4 py-[5px]">
            <HeartIcon className="h-4 w-4" />
            <span className="body2-semibold ml-[9px] text-gray-iron-950">D+{dDay}</span>
          </div>
        )}
      </header>

      {/* 메인 컨텐츠  */}
      <div className="mt-3 flex-1 px-5">
        {/* 연애 고민 상담 섹션 */}
        <ChatEntryCard isChatActive={isChatActive} />

        {/* 애착유형 테스트 섹션 */}
        {!hasAttachmentType && <AttachmentTestBanner />}

        {/* 오늘의 마음 질문 섹션 */}
        <div onClick={handleTodayQuestionClick} className="mt-8 cursor-pointer">
          <TodayQuestionSection todayQuestion={todayQuestion} />
        </div>

        {/* 애착유형 카드 섹션 */}
        <AttachmentTypeCards
          myAttachmentData={myAttachmentData}
          partnerAttachmentData={partnerAttachmentData}
          myAttachmentType={myAttachmentType}
          partnerAttachmentType={partnerAttachmentType}
          isPartnerConnected={isPartnerConnected}
        />
      </div>

      {/* 하단 네비게이션 */}
      <BottomNavigation />
    </div>
  )
}
