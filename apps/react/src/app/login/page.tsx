import { createFileRoute } from '@tanstack/react-router'
import AppleLogo from '@/assets/icons/apple-logo.svg'
import KakaoLogo from '@/assets/icons/kakao-logo.svg'
import malmoLogo from '@/assets/images/malmo-logo.png'
import { isWebView } from '@/shared/utils/webview'
import { useAlertDialog } from '@ui/common/hooks/alert-dialog.hook'
import { useAuth } from '@/features/auth'

export const Route = createFileRoute('/login/')({
  component: LoginPage,
})

export default function LoginPage() {
  const auth = useAuth()
  const navigate = Route.useNavigate()
  const { open } = useAlertDialog()

  const handleAppleLogin = async () => {
    try {
      if (isWebView()) {
        const result = await auth.socialLogin('apple')

        if (result.success) {
          navigate({ to: '/onboarding/term', replace: true })
        }
      } else {
        // ToDo
      }
    } catch (error: any) {
      open({
        title: '애플 로그인 실패',
        description: error?.message || '애플 로그인에 실패했습니다.',
      })
    }
  }

  const handleKakaoLogin = async () => {
    try {
      if (isWebView()) {
        // 네이티브 브릿지를 통한 카카오 로그인
        const result = await auth.socialLogin('kakao')

        if (result.success) {
          navigate({ to: '/onboarding/term', replace: true })
        }
      } else {
        //ToDo
      }
    } catch (error: any) {
      open({
        title: '카카오 로그인 실패',
        description: error?.message || '카카오 로그인에 실패했습니다.',
      })
    }
  }

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-white">
      {/* 로고 영역 */}
      <div className="flex w-full flex-1 flex-col items-center justify-center px-5">
        <div className="w-full">
          <div className="flex justify-center">
            <img src={malmoLogo} alt="말모 로고" className="h-auto w-[160px]" />
          </div>
        </div>
      </div>

      <div className="w-full px-5 pb-[calc(32px+env(safe-area-inset-bottom,0px))]">
        {/* 카카오 로그인 버튼 */}
        <button
          onClick={handleKakaoLogin}
          className="mb-3 flex h-[52px] w-full items-center justify-center rounded-[8px] bg-[#FEE500]"
        >
          <KakaoLogo className="mr-2" width={24} height={24} />
          <span className="body1-semibold text-[#16181D]">카카오로 시작하기</span>
        </button>

        {/* 애플 로그인 버튼 */}
        <button
          onClick={handleAppleLogin}
          className="flex h-[52px] w-full items-center justify-center rounded-[8px] bg-black text-white"
        >
          <AppleLogo className="mr-2" width={24} height={24} />
          <span className="body1-semibold text-[#FFFFFF]">Apple로 시작하기</span>
        </button>
      </div>
    </div>
  )
}
