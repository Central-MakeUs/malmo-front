import { ChatRoomStateDataChatRoomStateEnum, PartnerMemberDataMemberStateEnum } from '@data/user-api-axios/api'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

import HeartIcon from '@/assets/icons/heart.svg'
import malmoLogo from '@/assets/images/malmo-logo-small.png'
import { AnniversaryEditSheet } from '@/features/anniversary'
import { getAttachmentType } from '@/features/attachment'
import { AttachmentTestBanner } from '@/features/attachment/ui/attachment-test-banner'
import { AttachmentTypeCards } from '@/features/attachment/ui/attachment-type-cards'
import { useAuth } from '@/features/auth'
import { useChatRoomStatusQuery } from '@/features/chat/hooks/use-chat-queries'
import { ChatEntryCard } from '@/features/chat/ui/chat-entry-card'
import { usePartnerInfo } from '@/features/member'
import { useAppNotifications } from '@/features/notification'
import { useProfileEdit } from '@/features/profile'
import { TodayQuestionSection, useTodayQuestion } from '@/features/question'
import { wrapWithTracking } from '@/shared/analytics'
import { BUTTON_NAMES, CATEGORIES } from '@/shared/analytics/constants'
import { Screen } from '@/shared/layout/screen'
import { BottomNavigation } from '@/shared/ui/bottom-navigation'
import { calculateDDay } from '@/shared/utils/date'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  const { userInfo } = useAuth()
  const navigate = useNavigate()

  useAppNotifications()

  const { data: todayQuestion } = useTodayQuestion()
  const { data: partnerInfo } = usePartnerInfo()
  const profileEdit = useProfileEdit()

  const dDay = calculateDDay(userInfo.startLoveDate)

  const { data: chatRoomStatus } = useChatRoomStatusQuery()
  const isChatActive =
    chatRoomStatus === ChatRoomStateDataChatRoomStateEnum.Alive ||
    chatRoomStatus === ChatRoomStateDataChatRoomStateEnum.Paused ||
    chatRoomStatus === ChatRoomStateDataChatRoomStateEnum.NeedNextQuestion

  const hasAttachmentType = !!userInfo.loveTypeCategory

  // 파트너 연동 상태 확인
  const isPartnerConnected = !!partnerInfo && partnerInfo.memberState === PartnerMemberDataMemberStateEnum.Alive

  const myAttachmentData = getAttachmentType(userInfo.loveTypeCategory)
  const partnerAttachmentData = getAttachmentType(partnerInfo?.loveTypeCategory)

  const myAttachmentType = myAttachmentData?.character
  const partnerAttachmentType = partnerAttachmentData?.character

  const handleTodayQuestionClick = wrapWithTracking(BUTTON_NAMES.OPEN_TODAY_QUESTION, CATEGORIES.MAIN, () => {
    if (!todayQuestion?.coupleQuestionId) return

    if (todayQuestion.meAnswered) {
      navigate({
        to: '/question/see-answer',
        search: { coupleQuestionId: todayQuestion.coupleQuestionId },
      })
    } else {
      navigate({
        to: '/question/write-answer',
        search: { coupleQuestionId: todayQuestion.coupleQuestionId },
      })
    }
  })

  // 기념일 시트 열기 핸들러
  const handleAnniversaryEdit = wrapWithTracking(BUTTON_NAMES.OPEN_ANNIVERSARY_SHEET, CATEGORIES.PROFILE, () =>
    profileEdit.openAnniversarySheet()
  )

  return (
    <Screen>
      <Screen.Header behavior="overlay" className="bg-white">
        <div className="pt-safe-top flex h-[60px] items-center justify-between px-5">
          <img src={malmoLogo} alt="말모 로고" className="h-8 w-[94px]" />
          {isPartnerConnected && (
            <div
              className="flex h-8 items-center rounded-[30px] border border-gray-iron-200 px-4 py-[5px]"
              onClick={handleAnniversaryEdit}
            >
              <HeartIcon className="h-4 w-4" />
              <span className="body2-semibold ml-[9px] text-gray-iron-950">D+{dDay}</span>
            </div>
          )}
        </div>
      </Screen.Header>

      <Screen.Content className="no-bounce-scroll has-bottom-nav flex-1 bg-white px-5">
        <ChatEntryCard isChatActive={isChatActive} />

        {!hasAttachmentType && <AttachmentTestBanner />}

        <div onClick={handleTodayQuestionClick} className="mt-8 cursor-pointer">
          <TodayQuestionSection todayQuestion={todayQuestion} />
        </div>

        <AttachmentTypeCards
          myAttachmentData={myAttachmentData}
          partnerAttachmentData={partnerAttachmentData}
          myAttachmentType={myAttachmentType}
          partnerAttachmentType={partnerAttachmentType}
          isPartnerConnected={isPartnerConnected}
        />
      </Screen.Content>

      <BottomNavigation />

      <AnniversaryEditSheet
        isOpen={profileEdit.isAnniversarySheetOpen}
        onOpenChange={profileEdit.setAnniversarySheetOpen}
        onSave={wrapWithTracking(BUTTON_NAMES.SAVE_ANNIVERSARY, CATEGORIES.PROFILE)}
      />
    </Screen>
  )
}
