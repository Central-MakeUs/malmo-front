import { createFileRoute } from '@tanstack/react-router'
import AppleLogo from '@/assets/icons/apple-logo.svg'
import KakaoLogo from '@/assets/icons/kakao-logo.svg'
import malmoLogo from '@/assets/images/malmo-logo.png'
import { isWebView } from '@/shared/utils/webview'
import { useAuth } from '@/features/auth'
import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAlertDialog } from '@/shared/hook/alert-dialog.hook'

export const Route = createFileRoute('/login/')({
  component: LoginPage,
})

export default function LoginPage() {
  const auth = useAuth()
  const { open } = useAlertDialog()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAppleLogin = async () => {
    if (isSubmitting) return

    try {
      setIsSubmitting(true)

      if (isWebView()) {
        // 로그인 시도
        const result = await auth.socialLogin('apple')

        if (result.success) {
          // 온보딩 필요 여부에 따라 라우팅
          if (result.needsOnboarding) {
            navigate({ to: '/onboarding/terms' })
          } else {
            navigate({ to: '/' })
          }
        }
      } else {
        // ToDo: 웹뷰가 아닌 경우 처리
      }
    } catch (error: any) {
      open({
        title: '애플 로그인 실패',
        description: error?.message || '애플 로그인에 실패했습니다.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleKakaoLogin = async () => {
    if (isSubmitting) return

    try {
      setIsSubmitting(true)

      if (isWebView()) {
        // 로그인 시도
        const result = await auth.socialLogin('kakao')

        if (result.success) {
          // 온보딩 필요 여부에 따라 라우팅
          if (result.needsOnboarding) {
            navigate({ to: '/onboarding/terms' })
          } else {
            navigate({ to: '/' })
          }
        }
      } else {
        // ToDo: 웹뷰가 아닌 경우 처리
      }
    } catch (error: any) {
      open({
        title: '카카오 로그인 실패',
        description: error?.message || '카카오 로그인에 실패했습니다.',
      })
    } finally {
      setIsSubmitting(false)
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
          disabled={isSubmitting}
        >
          <KakaoLogo className="mr-2" width={24} height={24} />
          <span className="body1-semibold text-[#16181D]">{isSubmitting ? '로그인 중...' : '카카오로 시작하기'}</span>
        </button>

        {/* 애플 로그인 버튼 */}
        <button
          onClick={handleAppleLogin}
          className="flex h-[52px] w-full items-center justify-center rounded-[8px] bg-black text-white"
          disabled={isSubmitting}
        >
          <AppleLogo className="mr-2" width={24} height={24} />
          <span className="body1-semibold text-[#FFFFFF]">{isSubmitting ? '로그인 중...' : 'Apple로 시작하기'}</span>
        </button>
      </div>
    </div>
  )
}
