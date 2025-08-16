import { PartnerMemberDataMemberStateEnum } from '@data/user-api-axios/api'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useState } from 'react'

import ClipBoardIcon from '@/assets/icons/clip-board.svg'
import { useAuth } from '@/features/auth'
import { usePartnerInfo } from '@/features/member/hooks/use-partner-info'
import { PartnerCodeSheet, useProfileModal } from '@/features/profile'
import memberService from '@/shared/services/member.service'
import { queryKeys } from '@/shared/services/query-keys'
import { DetailHeaderBar } from '@/shared/ui/header-bar'
import { toast } from '@/shared/ui/toast'

export const Route = createFileRoute('/my-page/couple-management/')({
  component: CoupleManagementPage,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(memberService.inviteCodeQuery())
  },
})

function CoupleManagementPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { data: inviteCodeData } = useQuery(memberService.inviteCodeQuery())
  const inviteCode = inviteCodeData?.data?.coupleCode || ''
  const [isPartnerCodeSheetOpen, setIsPartnerCodeSheetOpen] = useState(false)
  const { refreshUserInfo } = useAuth()

  // 프로필 모달 훅
  const { coupleDisconnectModal, coupleConnectedModal } = useProfileModal()

  // 커플 연동 상태
  const { data: partnerInfo } = usePartnerInfo()
  const isConnected = !!partnerInfo && partnerInfo.memberState === PartnerMemberDataMemberStateEnum.Alive

  // 페이지 새로고침 함수
  const handleRefreshPage = async () => {
    await queryClient.setQueryData(queryKeys.member.partnerInfo(), null)
    queryClient.removeQueries({ queryKey: queryKeys.member.partnerInfo() })
    await refreshUserInfo()

    // 페이지 로더 새로고침
    router.invalidate()
  }

  const handleCopyInviteCode = async () => {
    try {
      await navigator.clipboard.writeText(inviteCode)
      toast.success('초대 코드 복사 완료! 연인에게 공유해 주세요')
    } catch (error) {
      console.error('클립보드 복사 실패:', error)
    }
  }

  const handleConnectPartner = () => {
    if (isConnected) return

    setIsPartnerCodeSheetOpen(true)
  }

  const handleDisconnectCouple = () => {
    coupleDisconnectModal(handleRefreshPage)
  }

  return (
    <div className="h-full bg-white">
      {/* 헤더 */}
      <DetailHeaderBar title="커플 연동 관리" />

      <div className="px-5">
        {/* 내 커플 코드 */}
        <div className="flex h-16 items-center pr-1">
          <span className="body1-medium text-gray-iron-950">내 커플 코드</span>
          <div className="ml-auto flex items-center">
            <span className="body2-medium text-gray-iron-950">{inviteCode}</span>
            <button onClick={handleCopyInviteCode} className="ml-2">
              <ClipBoardIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* 구분선 */}
        <hr className="h-px border-0 bg-gray-iron-100" />

        {/* 연인 코드로 연결하기 */}
        <button onClick={handleConnectPartner} className="flex h-16 w-full items-center" disabled={isConnected}>
          <span className={`body1-medium ${isConnected ? 'text-gray-iron-400' : 'text-gray-iron-950'}`}>
            연인 코드로 연결하기
          </span>
        </button>

        {/* 구분선 */}
        <hr className="h-px border-0 bg-gray-iron-100" />

        {/* 커플 연결 끊기 */}
        <button onClick={handleDisconnectCouple} className="flex h-16 w-full items-center" disabled={!isConnected}>
          <span className={`body1-medium ${isConnected ? 'text-gray-iron-950' : 'text-gray-iron-400'}`}>
            커플 연결 끊기
          </span>
        </button>
      </div>

      {/* 연인 코드 입력 바텀시트 */}
      <PartnerCodeSheet
        isOpen={isPartnerCodeSheetOpen}
        onOpenChange={setIsPartnerCodeSheetOpen}
        onSuccess={handleRefreshPage}
        onCoupleConnected={coupleConnectedModal}
      />
    </div>
  )
}
