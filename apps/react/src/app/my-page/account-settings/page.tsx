import { createFileRoute } from '@tanstack/react-router'
import { DetailHeaderBar } from '@/shared/components/header-bar'
import KakaoLogo from '@/assets/icons/kakao-circle.svg'

export const Route = createFileRoute('/my-page/account-settings/')({
  component: AccountSettingsComponent,
})

function AccountSettingsComponent() {
  const handleLogout = () => {
    console.log('로그아웃')
  }

  const handleWithdraw = () => {
    console.log('회원 탈퇴')
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <DetailHeaderBar title="계정 설정" />

      {/* 카카오 계정 */}
      <div className="flex h-16 items-center justify-between pr-6 pl-5">
        <div className="flex items-center">
          <KakaoLogo className="h-7 w-7" />
          <span className="body1-medium ml-2 text-gray-iron-950">카카오 계정</span>
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
    </div>
  )
}
