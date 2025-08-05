import { createFileRoute, useRouter } from '@tanstack/react-router' // useNavigate 제거, useRouter 사용
import AppleLogo from '@/assets/icons/apple-logo.svg'
import KakaoLogo from '@/assets/icons/kakao-logo.svg'
import malmoLogo from '@/assets/images/malmo-logo.png'
import { isWebView } from '@/shared/utils/webview'
import { useAuth } from '@/features/auth'
import { useEffect, useState } from 'react'
import { SocialLoginType } from '@bridge/types'

export const Route = createFileRoute('/login/')({
  component: LoginPage,
})

export default function LoginPage() {
  const auth = useAuth()
  const router = useRouter() // router 인스턴스 가져오기
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isIos, setIsIos] = useState(false)

  useEffect(() => {
    setIsIos(/iPhone|iPad|iPod/i.test(navigator.userAgent))
  }, [])

  const handleLogin = async (provider: SocialLoginType) => {
    if (isSubmitting) return

    try {
      setIsSubmitting(true)
      if (isWebView()) {
        const result = await auth.socialLogin(provider)
        if (result.success) {
          // 로그인 성공 시, 라우터 상태를 갱신하여
          // __root.tsx의 beforeLoad가 새 상태로 다시 실행되도록 함
          await router.invalidate()
          router.navigate({ to: '/' })
        }
      } else {
        // ToDo: 웹뷰가 아닌 경우 처리
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-white">
      {/* 로고 영역 */}
      <div className="flex w-full flex-1 flex-col items-center justify-center px-5">
        <div className="w-full">
          <div className="flex flex-col items-center justify-center gap-2">
            <p className="body1-semibold text-gray-iron-950">
              <span className="text-malmo-rasberry-500">말</span>을 <span className="text-malmo-rasberry-500">모</span>
              아 마음을 이어주는
            </p>
            <img src={malmoLogo} alt="말모 로고" className="h-auto w-[160px]" />
          </div>
        </div>
      </div>

      <div className="w-full px-5 pb-[calc(32px+env(safe-area-inset-bottom,0px))]">
        {/* 카카오 로그인 버튼 */}
        {isWebView() ? (
          <button
            onClick={() => handleLogin('kakao')}
            className="mb-3 flex h-[52px] w-full items-center justify-center rounded-[8px] bg-[#FEE500]"
            disabled={isSubmitting}
          >
            <KakaoLogo className="mr-2" width={18} height={18} />
            <span className="body1-semibold text-[#16181D]">{'카카오로 시작하기'}</span>
          </button>
        ) : (
          <p className="body1-semibold mb-[100px] text-center text-gray-iron-950">이제 앱 스토어에서 만나보세요.</p>
        )}

        {/* 애플 로그인 버튼 */}
        {isIos && (
          <button
            onClick={() => handleLogin('apple')}
            className="flex h-[52px] w-full items-center justify-center rounded-[8px] bg-black text-white"
            disabled={isSubmitting}
          >
            <AppleLogo className="mr-2" width={18} height={18} />
            <span className="body1-semibold text-[#FFFFFF]">{'Apple로 시작하기'}</span>
          </button>
        )}
      </div>
    </div>
  )
}
