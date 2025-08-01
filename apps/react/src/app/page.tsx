import { createFileRoute, Link } from '@tanstack/react-router'
import malmoLogo from '@/assets/images/malmo-logo-small.png'
import HeartIcon from '@/assets/icons/heart.svg'

import { BottomNavigation } from '@/shared/ui/bottom-navigation'
import { useAuth } from '@/features/auth'
import { calculateDDay } from '@/shared/utils/date'
import { ChatEntryCard } from '@/features/chat/components/chat-entry-card'
import { AttachmentTestBanner } from '@/features/attachment/ui/attachment-test-banner'
import { TodayQuestionSection, useTodayQuestion } from '@/features/question'
import { AttachmentTypeCards } from '@/features/attachment/ui/attachment-type-cards'
import { getAttachmentType } from '@/features/attachment'
import { usePartnerInfo } from '@/features/member'
import { useChatRoomStatusQuery } from '@/features/chat/hook/use-chat-queries'
import questionService from '@/shared/services/question.service'
import memberService from '@/shared/services/member.service'
import chatService from '@/shared/services/chat.service'
import { ChatRoomStateDataChatRoomStateEnum } from '@data/user-api-axios/api'

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

  const { data: todayQuestion } = useTodayQuestion()
  const { data: partnerInfo, error: partnerError } = usePartnerInfo()

  // D-day 계산
  const dDay = calculateDDay(userInfo.startLoveDate)

  // 채팅방 상태 확인
  const { data: chatRoomStatus } = useChatRoomStatusQuery()
  const isChatActive = chatRoomStatus === ChatRoomStateDataChatRoomStateEnum.Alive

  // 애착유형이 있는지 확인
  const hasAttachmentType = !!userInfo.loveTypeCategory

  // 파트너 연동 상태 확인
  const isPartnerConnected = !partnerError || (partnerError as any)?.status !== 403

  const myAttachmentData = getAttachmentType(userInfo.loveTypeCategory)
  const partnerAttachmentData = getAttachmentType(partnerInfo?.loveTypeCategory)

  const myAttachmentType = myAttachmentData?.character
  const partnerAttachmentType = partnerAttachmentData?.character

  return (
    <div className="flex h-full flex-col bg-white pt-[60px]">
      {/* 헤더 */}
      <header className="fixed top-0 flex h-[60px] w-full items-center justify-between bg-white px-5">
        <img src={malmoLogo} alt="말모 로고" className="h-8 w-[94px]" />

        {/* D-day */}
        <div className="flex h-8 items-center rounded-[30px] border border-gray-iron-200 px-4 py-[5px]">
          <HeartIcon className="h-4 w-4" />
          <span className="body3-medium ml-[9px] text-gray-iron-950">D+{dDay}</span>
        </div>
      </header>

      {/* 메인 컨텐츠  */}
      <div className="mt-3 flex-1 px-5">
        {/* 연애 고민 상담 섹션 */}
        <ChatEntryCard isChatActive={isChatActive} />

        {/* 애착유형 테스트 섹션 */}
        {!hasAttachmentType && <AttachmentTestBanner />}

        {/* 오늘의 마음 질문 섹션 */}
        <Link to={'/question'}>
          <TodayQuestionSection todayQuestion={todayQuestion} />
        </Link>

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
