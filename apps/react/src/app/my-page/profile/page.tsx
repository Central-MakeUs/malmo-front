import { createFileRoute, useNavigate } from '@tanstack/react-router'

import { getAttachmentType } from '@/features/attachment'
import { useAuth } from '@/features/auth'
import { wrapWithTracking } from '@/shared/analytics'
import { BUTTON_NAMES, CATEGORIES } from '@/shared/analytics/constants'
import { Screen } from '@/shared/layout/screen'
import { cn } from '@/shared/lib/cn'
import { Badge } from '@/shared/ui/badge'
import { DetailHeaderBar } from '@/shared/ui/header-bar'

export const Route = createFileRoute('/my-page/profile/')({
  component: ProfileManagementPage,
})

function ProfileManagementPage() {
  const navigate = useNavigate()
  const { userInfo } = useAuth()

  const myMbti = userInfo.personalityType?.toUpperCase()
  const partnerMbti = userInfo.otherPersonalityType?.toUpperCase()
  const myAttachmentSubtype = getAttachmentType(userInfo.loveTypeCategory)?.subtype
  const partnerAttachmentSubtype = getAttachmentType(userInfo.partnerLoveTypeCategory)?.subtype
  const myBadgeText = myAttachmentSubtype ? `${myMbti ? myMbti + ' ' : ''}${myAttachmentSubtype}` : undefined
  const partnerBadgeText = partnerAttachmentSubtype
    ? `${partnerMbti ? partnerMbti + ' ' : ''}${partnerAttachmentSubtype}`
    : undefined

  return (
    <Screen>
      <Screen.Header behavior="overlay">
        <DetailHeaderBar title="프로필 관리" />
      </Screen.Header>

      <Screen.Content className="bg-white">
        <div className="px-5 pt-8">
          <ProfileRow
            label="현재 연애 상태"
            onClick={wrapWithTracking(BUTTON_NAMES.OPEN_PROFILE_RELATIONSHIP_STATUS, CATEGORIES.PROFILE, () =>
              navigate({ to: '/relationship-status' })
            )}
          />
          <ProfileRow
            label="내 성향"
            badge={myBadgeText ? { text: myBadgeText, variant: 'completed' } : undefined}
            onClick={wrapWithTracking(BUTTON_NAMES.OPEN_PROFILE_MBTI, CATEGORIES.PROFILE, () =>
              navigate({
                to: '/mbti',
                search: { flow: 'my-personality', from: userInfo.loveTypeCategory ? 'profile' : 'profile-result' },
              })
            )}
          />

          <ProfileRow
            label="상대 성향"
            badge={partnerBadgeText ? { text: partnerBadgeText, variant: 'rasberry' } : null}
            onClick={wrapWithTracking(BUTTON_NAMES.OPEN_PROFILE_PARTNER_MBTI, CATEGORIES.PROFILE, () =>
              navigate({ to: '/partner-mbti', search: { flow: 'partner-personality', from: 'profile' } })
            )}
          />
        </div>
      </Screen.Content>
    </Screen>
  )
}

function ProfileRow({
  label,
  badge,
  onClick,
}: {
  label: string
  value?: string
  badge?: { text: string; variant: 'default' | 'completed' | 'rasberry' } | null
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between border-b border-gray-iron-100 py-6 text-left"
    >
      <span className="body1-medium text-gray-iron-950">{label}</span>
      <div className={cn('flex items-center gap-2')}>
        {badge && <Badge variant={badge.variant}>{badge.text}</Badge>}
      </div>
    </button>
  )
}
