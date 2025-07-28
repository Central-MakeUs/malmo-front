import { createFileRoute } from '@tanstack/react-router'
import { DetailHeaderBar } from '@/shared/components/header-bar'
import { useAuth } from '@/features/auth'
import { MemberDataProviderEnum } from '@data/user-api-axios/api'
import { LogoutModal, WithdrawModal } from '@/features/profile'
import { useState } from 'react'
import KakaoCircle from '@/assets/icons/kakao-circle.svg'
import AppleCircle from '@/assets/icons/apple-circle.svg'

export const Route = createFileRoute('/my-page/account-settings/')({
  component: AccountSettingsComponent,
})

function AccountSettingsComponent() {
  const { userInfo } = useAuth()
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false)

  // 소셜 계정 정보 조회
  const getProviderInfo = () => {
    if (userInfo.provider === MemberDataProviderEnum.Apple) {
      return {
        icon: AppleCircle,
        text: 'Apple 계정',
      }
    }
    return {
      icon: KakaoCircle,
      text: '카카오 계정',
    }
  }

  const { icon: ProviderIcon, text: providerText } = getProviderInfo()

  const handleLogout = () => {
    setIsLogoutModalOpen(true)
  }

  const handleWithdraw = () => {
    setIsWithdrawModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <DetailHeaderBar title="계정 설정" />

      {/* 소셜 계정 */}
      <div className="flex h-16 items-center justify-between pr-6 pl-5">
        <div className="flex items-center">
          <ProviderIcon className="h-7 w-7" />
          <span className="body1-medium ml-2 text-gray-iron-950">{providerText}</span>
        </div>
        <button onClick={handleLogout} className="body2-medium text-gray-iron-950">
          로그아웃
        </button>
      </div>

      {/* 구분선 */}
      <hr className="h-px border-0 bg-gray-iron-100" />

      {/* 회원 탈퇴 */}
      <div className="flex h-16 items-center justify-between pr-6 pl-5">
        <span className="body3-medium text-gray-iron-400">회원 정보를 삭제하시겠어요?</span>
        <button onClick={handleWithdraw} className="body3-medium text-gray-iron-400">
          회원 탈퇴
        </button>
      </div>

      {/* 로그아웃 모달 */}
      <LogoutModal isOpen={isLogoutModalOpen} onOpenChange={setIsLogoutModalOpen} />

      {/* 회원 탈퇴 모달 */}
      <WithdrawModal isOpen={isWithdrawModalOpen} onOpenChange={setIsWithdrawModalOpen} />
    </div>
  )
}
