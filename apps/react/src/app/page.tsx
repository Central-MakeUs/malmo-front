import { createFileRoute, useNavigate } from '@tanstack/react-router'

import malmoLogo from '@/assets/images/malmo-logo-small.png'
import { getAttachmentType, AttachmentTypeCards } from '@/features/attachment'
import { useAuth } from '@/features/auth'
import { ChatEntryCard } from '@/features/chat/ui/chat-entry-card'
import { useChatHistoryQuery } from '@/features/history/hooks/use-chat-history-query'
import { RecentChatSection } from '@/features/history/ui/recent-chat-section'
import { usePartnerInfo } from '@/features/member'
import { useAppNotifications } from '@/features/notification'
import { Screen } from '@/shared/layout/screen'
import { BottomNavigation } from '@/shared/ui/bottom-navigation'
import { BellNotificationIcon, KeyMessageBanner } from '@/shared/ui/key-message-banner'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  const { userInfo } = useAuth()
  const navigate = useNavigate()

  useAppNotifications()

  const { data: partnerInfo } = usePartnerInfo()

  const { data: historyData } = useChatHistoryQuery({})
  const histories = historyData?.pages.flatMap((page) => page?.list ?? []) ?? []
  const totalHistoryCount = historyData?.pages[0]?.totalCount ?? histories.length

  // 애착유형 데이터
  const myAttachmentData = getAttachmentType(userInfo.loveTypeCategory)
  const partnerAttachmentData = partnerInfo?.loveTypeCategory ? getAttachmentType(partnerInfo.loveTypeCategory) : null
  const myAttachmentType = myAttachmentData?.subtype
  const partnerAttachmentType = partnerAttachmentData?.subtype

  // 배너 - 미완성 성향 카드 수
  const missingPersonalityCount =
    (!userInfo.loveTypeCategory ? 1 : 0) +
    (!userInfo.partnerLoveTypeCategory || userInfo.partnerLoveTypeCategory === 'UNKNOWN' ? 1 : 0)

  const handleBannerClick = () => {
    const myComplete = !!userInfo.personalityType && !!userInfo.loveTypeCategory
    if (!myComplete) {
      navigate({ to: '/personality-flow-loading', search: { flow: 'my-personality' } })
    } else {
      navigate({ to: '/personality-flow-loading', search: { flow: 'partner-personality' } })
    }
  }

  // 내 성향카드 클릭
  const handleMyCardClick = () => {
    const myComplete = !!userInfo.personalityType && !!userInfo.loveTypeCategory
    if (myComplete) {
      navigate({ to: '/attachment-test/result/my' })
      return
    }
    if (!userInfo.personalityType) {
      navigate({ to: '/mbti', search: { flow: 'my-personality' } })
    } else {
      navigate({ to: '/my-attachment-select', search: { flow: 'my-personality' } })
    }
  }

  // 상대 성향카드 클릭
  const handlePartnerCardClick = () => {
    const partnerComplete =
      !!userInfo.partnerLoveTypeCategory && userInfo.partnerLoveTypeCategory !== 'UNKNOWN' && !!partnerAttachmentData
    if (partnerComplete) {
      navigate({ to: '/attachment-test/result/partner' })
      return
    }
    if (!userInfo.otherPersonalityType) {
      navigate({ to: '/partner-mbti', search: { flow: 'partner-personality' } })
    } else {
      navigate({ to: '/partner-attachment-select', search: { flow: 'partner-personality' } })
    }
  }

  return (
    <Screen>
      <Screen.Header behavior="overlay" className="bg-white">
        <div className="pt-safe-top flex h-[60px] items-center justify-between px-5">
          <img src={malmoLogo} alt="말모 로고" className="h-8 w-[94px]" />
        </div>
      </Screen.Header>

      <Screen.Content className="no-bounce-scroll has-bottom-nav flex-1 bg-white px-5">
        <ChatEntryCard />

        {missingPersonalityCount > 0 && (
          <KeyMessageBanner
            icon={<BellNotificationIcon />}
            subtitle={`아직 채우지 않은 성향 카드 ${missingPersonalityCount}건`}
            title="완성하러 가기"
            onClick={handleBannerClick}
          />
        )}

        <RecentChatSection histories={histories} totalHistoryCount={totalHistoryCount} />

        <AttachmentTypeCards
          myAttachmentData={myAttachmentData}
          partnerAttachmentData={partnerAttachmentData}
          myAttachmentType={myAttachmentType}
          partnerAttachmentType={partnerAttachmentType}
          onMyCardClick={handleMyCardClick}
          onPartnerCardClick={handlePartnerCardClick}
        />
      </Screen.Content>

      <BottomNavigation />
    </Screen>
  )
}
