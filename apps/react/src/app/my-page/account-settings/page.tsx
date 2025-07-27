import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { DetailHeaderBar } from '@/shared/components/header-bar'
import { useAuth } from '@/features/auth'
import { useAlertDialog } from '@/shared/hook/alert-dialog.hook'
import { MemberDataProviderEnum } from '@data/user-api-axios/api'
import memberService from '@/shared/services/member.service'
import KakaoCircle from '@/assets/icons/kakao-circle.svg'
import AppleCircle from '@/assets/icons/apple-circle.svg'

export const Route = createFileRoute('/my-page/account-settings/')({
  component: AccountSettingsComponent,
})

function AccountSettingsComponent() {
  const { userInfo, logout } = useAuth()
  const { open } = useAlertDialog()
  const navigate = useNavigate()

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
    open({
      title: '로그아웃 하시겠어요?',
      cancelText: '취소하기',
      confirmText: '로그아웃',
      onConfirm: async () => {
        try {
          const result = await logout()
          if (result.success) {
            navigate({ to: '/login' })
          }
        } catch (error: any) {
          open({
            title: '로그아웃 실패',
            description: error.message || '로그아웃에 실패했습니다.',
            confirmText: '확인',
          })
        }
      },
    })
  }

  const handleWithdraw = () => {
    open({
      title: '정말 계정을 탈퇴하시겠어요?',
      description: '탈퇴 시 커플 연동이 자동으로 끊기며 모든 기록은 복구할 수 없어요.',
      cancelText: '취소하기',
      confirmText: '탈퇴하기',
      onConfirm: async () => {
        try {
          const result = await memberService.deleteMember()
          if (result.data?.success) {
            // 로그아웃 처리
            await logout()
            navigate({ to: '/login' })
          } else {
            throw new Error(result.data?.message || '회원 탈퇴에 실패했습니다.')
          }
        } catch (error: any) {
          open({
            title: '회원 탈퇴 실패',
            description: error.message || '회원 탈퇴에 실패했습니다.',
            confirmText: '확인',
          })
        }
      },
    })
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
    </div>
  )
}
