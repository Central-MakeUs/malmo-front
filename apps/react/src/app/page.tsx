import { PartnerMemberDataMemberStateEnum } from '@data/user-api-axios/api'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'

import HeartIcon from '@/assets/icons/heart.svg'
import malmoLogo from '@/assets/images/malmo-logo-small.png'
import momoHomeChattingImage from '@/assets/images/onboarding-end-2.png'
import { AnniversaryEditSheet } from '@/features/anniversary'
import { getAttachmentType } from '@/features/attachment'
import { AttachmentTestBanner } from '@/features/attachment/ui/attachment-test-banner'
import { AttachmentTypeCards } from '@/features/attachment/ui/attachment-type-cards'
import { useAuth } from '@/features/auth'
import { ChatEntryCard } from '@/features/chat/ui/chat-entry-card'
import { useChatHistoryQuery } from '@/features/history/hooks/use-chat-history-query'
import { RecentChatSection } from '@/features/history/ui/recent-chat-section'
import { usePartnerInfo } from '@/features/member'
import { useAppNotifications } from '@/features/notification'
import { useProfileEdit } from '@/features/profile'
import {
  getRequiredProfileFlowStartPath,
  requiredProfileFlowSearchSchema,
} from '@/features/profile/lib/required-profile-flow'
import { wrapWithTracking } from '@/shared/analytics'
import { BUTTON_NAMES, CATEGORIES } from '@/shared/analytics/constants'
import { useAlertDialog } from '@/shared/hooks/use-alert-dialog'
import { Screen } from '@/shared/layout/screen'
import { BottomNavigation } from '@/shared/ui/bottom-navigation'
import { calculateDDay } from '@/shared/utils/date'

export const Route = createFileRoute('/')({
  component: HomePage,
})

// 모듈 스코프: 컴포넌트 리마운트에 영향받지 않음
let hasOpenedRequiredProfileDialog = false

function HomePage() {
  const navigate = useNavigate()
  const { userInfo } = useAuth()
  const { open: openAlertDialog, isOpen: isAlertDialogOpen } = useAlertDialog()

  useAppNotifications()

  const { data: partnerInfo } = usePartnerInfo()
  const profileEdit = useProfileEdit()

  const dDay = calculateDDay(userInfo.startLoveDate)

  const { data: historyData } = useChatHistoryQuery({})
  const histories = historyData?.pages.flatMap((page) => page?.list ?? []) ?? []
  const totalHistoryCount = historyData?.pages[0]?.totalCount ?? histories.length

  const hasAttachmentType = !!userInfo.loveTypeCategory
  const requiredProfileStartPath = getRequiredProfileFlowStartPath(userInfo)

  // 파트너 연동 상태 확인
  const isPartnerConnected = !!partnerInfo && partnerInfo.memberState === PartnerMemberDataMemberStateEnum.Alive

  const myAttachmentData = getAttachmentType(userInfo.loveTypeCategory)
  const partnerAttachmentData = getAttachmentType(partnerInfo?.loveTypeCategory)

  const myAttachmentType = myAttachmentData?.character
  const partnerAttachmentType = partnerAttachmentData?.character

  // 기념일 시트 열기 핸들러
  const handleAnniversaryEdit = wrapWithTracking(BUTTON_NAMES.OPEN_ANNIVERSARY_SHEET, CATEGORIES.PROFILE, () =>
    profileEdit.openAnniversarySheet()
  )
  useEffect(() => {
    if (!requiredProfileStartPath) {
      hasOpenedRequiredProfileDialog = false
      return
    }

    if (hasOpenedRequiredProfileDialog) return
    if (isAlertDialogOpen) return

    hasOpenedRequiredProfileDialog = true

    openAlertDialog({
      title: '모모의 연애 상담이 새로워졌어요',
      description: (
        <>
          모모가 기억할 연애 정보를 입력하고
          <br />
          연애 상담을 시작해 보세요
        </>
      ),
      image: (
        <img src={momoHomeChattingImage} alt="연애 상담 정보 입력" className="h-[164px] w-[184px] object-contain" />
      ),
      confirmText: '정보 입력하러 가기',
      onConfirm: wrapWithTracking(BUTTON_NAMES.GO_REQUIRED_PROFILE_FLOW, CATEGORIES.MAIN, () => {
        const parsedSearch = requiredProfileFlowSearchSchema.parse({ requiredProfileFlow: true })
        navigate({ to: requiredProfileStartPath, search: parsedSearch, replace: true })
      }),
      preventClose: true,
    })
  }, [isAlertDialogOpen, navigate, openAlertDialog, requiredProfileStartPath])

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
        <ChatEntryCard />

        {!hasAttachmentType && <AttachmentTestBanner />}

        <RecentChatSection histories={histories} totalHistoryCount={totalHistoryCount} />

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
