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
    // 상대 애착유형 저장 필드가 없으므로 otherPersonalityType으로 완료 여부 판단 (TODO: BE 필드 추가 후 개선)
    const partnerComplete = !!userInfo.otherPersonalityType && !!partnerAttachmentData
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
