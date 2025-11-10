import { PartnerMemberDataMemberStateEnum } from '@data/user-api-axios/api'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

import ClipBoardIcon from '@/assets/icons/clip-board.svg'
import { AnniversaryEditSheet } from '@/features/anniversary'
import { useAuth } from '@/features/auth'
import { usePartnerInfo } from '@/features/member/hooks/use-partner-info'
import { useProfileEdit, useProfileModal } from '@/features/profile'
import { wrapWithTracking } from '@/shared/analytics'
import { BUTTON_NAMES, CATEGORIES } from '@/shared/analytics/constants'
import { Screen } from '@/shared/layout/screen'
import memberService from '@/shared/services/member.service'
import { queryKeys } from '@/shared/services/query-keys'
import { DetailHeaderBar } from '@/shared/ui/header-bar'
import { PageLoadingFallback } from '@/shared/ui/loading-fallback'
import { toast } from '@/shared/ui/toast'

export const Route = createFileRoute('/my-page/couple-management/')({
  component: CoupleManagementPage,
})

function CoupleManagementPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { data: inviteCodeData, isLoading } = useQuery(memberService.inviteCodeQuery())
  const inviteCode = inviteCodeData?.data?.coupleCode || ''
  const { refreshUserInfo } = useAuth()
  const profileEdit = useProfileEdit()

  // 프로필 모달 훅
  const { coupleDisconnectModal } = useProfileModal()

  // 커플 연동 상태
  const { data: partnerInfo } = usePartnerInfo()
  const isPartnerConnected = !!partnerInfo && partnerInfo.memberState === PartnerMemberDataMemberStateEnum.Alive

  // 페이지 새로고침 함수
  const handleRefreshPage = async () => {
    await queryClient.setQueryData(queryKeys.member.partnerInfo(), null)
    queryClient.removeQueries({ queryKey: queryKeys.member.partnerInfo() })
    await refreshUserInfo()
    await queryClient.invalidateQueries({ queryKey: memberService.inviteCodeQuery().queryKey })
  }

  const handleCopyInviteCode = wrapWithTracking(BUTTON_NAMES.COPY_INVITE_CODE, CATEGORIES.PROFILE, async () => {
    try {
      await navigator.clipboard.writeText(inviteCode)
      toast.success('초대 코드 복사 완료! 연인에게 공유해 주세요')
    } catch (error) {
      console.error('클립보드 복사 실패:', error)
    }
  })

  const handleAnniversaryEdit = wrapWithTracking(BUTTON_NAMES.OPEN_ANNIVERSARY_SHEET, CATEGORIES.PROFILE, () =>
    profileEdit.openAnniversarySheet()
  )

  const handleConnectPartner = wrapWithTracking(BUTTON_NAMES.OPEN_PARTNER_SHEET, CATEGORIES.PROFILE, () => {
    if (isPartnerConnected) return
    navigate({ to: '/my-page/couple-management/partner-code', replace: true })
  })

  const handleDisconnectCouple = wrapWithTracking(BUTTON_NAMES.DISCONNECT_COUPLE, CATEGORIES.PROFILE, () =>
    coupleDisconnectModal(handleRefreshPage)
  )

  if (isLoading) {
    return <PageLoadingFallback />
  }

  return (
    <Screen>
      <Screen.Header behavior="overlay">
        <DetailHeaderBar title="커플 연동 관리" />
      </Screen.Header>

      <Screen.Content className="bg-white">
        <div className="px-5">
          <div className="flex h-16 items-center pr-1">
            <span className="body1-medium text-gray-iron-950">내 커플 코드</span>
            <div className="ml-auto flex items-center">
              <span className="body2-medium text-gray-iron-950">{inviteCode}</span>
              <button onClick={handleCopyInviteCode} className="ml-2">
                <ClipBoardIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          <hr className="h-px border-0 bg-gray-iron-100" />

          <button
            onClick={handleAnniversaryEdit}
            className="flex h-16 w-full items-center"
            disabled={!isPartnerConnected}
          >
            <span className={`body1-medium ${isPartnerConnected ? 'text-gray-iron-950' : 'text-gray-iron-400'}`}>
              디데이 설정
            </span>
          </button>

          <hr className="h-px border-0 bg-gray-iron-100" />

          <button
            onClick={handleConnectPartner}
            className="flex h-16 w-full items-center"
            disabled={isPartnerConnected}
          >
            <span className={`body1-medium ${isPartnerConnected ? 'text-gray-iron-400' : 'text-gray-iron-950'}`}>
              연인 코드로 연결하기
            </span>
          </button>

          <hr className="h-px border-0 bg-gray-iron-100" />

          <button
            onClick={handleDisconnectCouple}
            className="flex h-16 w-full items-center"
            disabled={!isPartnerConnected}
          >
            <span className={`body1-medium ${isPartnerConnected ? 'text-gray-iron-950' : 'text-gray-iron-400'}`}>
              커플 연결 끊기
            </span>
          </button>
        </div>
      </Screen.Content>

      <AnniversaryEditSheet
        isOpen={profileEdit.isAnniversarySheetOpen}
        onOpenChange={profileEdit.setAnniversarySheetOpen}
        onSave={wrapWithTracking(BUTTON_NAMES.SAVE_ANNIVERSARY, CATEGORIES.PROFILE)}
      />
    </Screen>
  )
}
