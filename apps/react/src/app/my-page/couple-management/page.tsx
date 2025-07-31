import { createFileRoute, useLoaderData, useRouter } from '@tanstack/react-router'
import { DetailHeaderBar } from '@/shared/components/header-bar'
import ClipBoardIcon from '@/assets/icons/clip-board.svg'
import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import memberService from '@/shared/services/member.service'
import { usePartnerInfo } from '@/features/member/hooks/use-partner-info'
import { PartnerCodeSheet, useProfileModal } from '@/features/profile'
import bridge from '@/shared/bridge'

export const Route = createFileRoute('/my-page/couple-management/')({
  component: CoupleManagementPage,
  loader: async () => {
    try {
      const response = await memberService.inviteCode()
      return {
        inviteCode: response.data?.coupleCode || '',
      }
    } catch (error) {
      // Todo 에러 처리
      return {
        inviteCode: '',
      }
    }
  },
})

function CoupleManagementPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { inviteCode } = useLoaderData({ from: '/my-page/couple-management/' })
  const [isPartnerCodeSheetOpen, setIsPartnerCodeSheetOpen] = useState(false)

  // 프로필 모달 훅
  const { coupleDisconnectModal, coupleConnectedModal } = useProfileModal()

  // 커플 연동 상태
  const { data: partnerInfo } = usePartnerInfo()
  const isConnected = !!partnerInfo

  // 페이지 새로고침 함수
  const handleRefreshPage = () => {
    queryClient.setQueryData(['partnerInfo'], null)
    queryClient.removeQueries({ queryKey: ['partnerInfo'] })

    // 페이지 로더 새로고침
    router.invalidate()
  }

  const handleCopyInviteCode = async () => {
    try {
      await navigator.clipboard.writeText(inviteCode)
      // TODO: 토스트 메시지 표시
    } catch (error) {
      console.error('클립보드 복사 실패:', error)
    }
  }

  const handleConnectPartner = () => {
    if (isConnected) return

    bridge.toggleOverlay(3)
    setIsPartnerCodeSheetOpen(true)
  }

  const handleDisconnectCouple = () => {
    coupleDisconnectModal(handleRefreshPage)
  }

  return (
    <div className="min-h-screen bg-white">
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

        {/* 상대방 코드로 연결하기 */}
        <button onClick={handleConnectPartner} className="flex h-16 w-full items-center" disabled={isConnected}>
          <span className={`body1-medium ${isConnected ? 'text-gray-iron-400' : 'text-gray-iron-950'}`}>
            상대방 코드로 연결하기
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

      {/* 상대방 코드 입력 바텀시트 */}
      <PartnerCodeSheet
        isOpen={isPartnerCodeSheetOpen}
        onOpenChange={setIsPartnerCodeSheetOpen}
        onSuccess={handleRefreshPage}
        onCoupleConnected={coupleConnectedModal}
      />
    </div>
  )
}
