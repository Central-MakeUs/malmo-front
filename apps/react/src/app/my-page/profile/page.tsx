import { createFileRoute, useNavigate } from '@tanstack/react-router'

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

const RELATIONSHIP_LABELS: Record<string, string> = {
  IN_RELATIONSHIP: '연애 중',
  SEEING_SOMEONE: '썸',
  BREAKUP: '이별',
}

function ProfileManagementPage() {
  const navigate = useNavigate()
  const { userInfo } = useAuth()

  const myMbti = userInfo.personalityType?.toUpperCase()
  const partnerMbti = userInfo.otherPersonalityType?.toUpperCase()
  const relationshipLabel = userInfo.relationshipStatus ? RELATIONSHIP_LABELS[userInfo.relationshipStatus] : undefined

  return (
      <Screen>
      <Screen.Header behavior="overlay">
        <DetailHeaderBar title="프로필 관리" />
      </Screen.Header>

      <Screen.Content className="bg-white">
        <div className="px-5 pt-8">
          <ProfileRow
            label="현재 연애 상태"
            value={relationshipLabel}
            onClick={wrapWithTracking(BUTTON_NAMES.OPEN_PROFILE_RELATIONSHIP_STATUS, CATEGORIES.PROFILE, () =>
              navigate({ to: '/relationship-status' })
            )}
          />
          <ProfileRow
            label="내 성향"
            badge={myMbti ? { text: myMbti, variant: 'completed' } : { text: '미입력', variant: 'default' }}
            onClick={wrapWithTracking(BUTTON_NAMES.OPEN_PROFILE_MBTI, CATEGORIES.PROFILE, () =>
              navigate({ to: '/mbti' })
            )}
          />
          <ProfileRow
            label="상대 성향"
            badge={partnerMbti ? { text: partnerMbti, variant: 'rasberry' } : { text: '미입력', variant: 'default' }}
            onClick={wrapWithTracking(BUTTON_NAMES.OPEN_PROFILE_PARTNER_MBTI, CATEGORIES.PROFILE, () =>
              navigate({ to: '/partner-mbti' })
            )}
          />
        </div>
      </Screen.Content>
    </Screen>
  )
}

function ProfileRow({
  label,
  value,
  badge,
  onClick,
}: {
  label: string
  value?: string
  badge?: { text: string; variant: 'default' | 'completed' | 'rasberry' }
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between border-b border-gray-iron-100 py-6 text-left"
    >
      <span className="body1-semibold text-gray-iron-950">{label}</span>
      <div className={cn('flex items-center gap-2')}>
        {value && <span className="body3-medium text-gray-iron-500">{value}</span>}
        {badge && <Badge variant={badge.variant}>{badge.text}</Badge>}
      </div>
    </button>
  )
}
