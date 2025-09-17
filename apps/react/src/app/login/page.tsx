import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

import AppleLogo from '@/assets/icons/apple-logo.svg'
import KakaoLogo from '@/assets/icons/kakao-logo.svg'
import malmoLogo from '@/assets/images/malmo-logo.png'
import { useAuth } from '@/features/auth'
import { wrapWithTracking } from '@/shared/analytics'
import { BUTTON_NAMES, CATEGORIES } from '@/shared/analytics/constants'
import { isWebView } from '@/shared/utils/webview'

export const Route = createFileRoute('/login/')({
  component: LoginPage,
})

export default function LoginPage() {
  const auth = useAuth()
  const router = useRouter() // 라우터 인스턴스 가져오기
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isIos, setIsIos] = useState(false)

  useEffect(() => {
    setIsIos(/iPhone|iPad|iPod/i.test(navigator.userAgent))
  }, [])

  const handleKakaoLogin = wrapWithTracking(BUTTON_NAMES.LOGIN_KAKAO, CATEGORIES.AUTH, async () => {
    if (isSubmitting) return
    try {
      setIsSubmitting(true)
      if (isWebView()) {
        const result = await auth.socialLogin('kakao')
        if (result.success) {
          await router.invalidate()
          router.navigate({ to: '/' })
        }
      }
    } finally {
      setIsSubmitting(false)
    }
  })

  const handleAppleLogin = wrapWithTracking(BUTTON_NAMES.LOGIN_APPLE, CATEGORIES.AUTH, async () => {
    if (isSubmitting) return
    try {
      setIsSubmitting(true)
      if (isWebView()) {
        const result = await auth.socialLogin('apple')
        if (result.success) {
          await router.invalidate()
          router.navigate({ to: '/' })
        }
      }
    } finally {
      setIsSubmitting(false)
    }
  })

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-white">
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

      <div className="mt-auto mb-5 w-full px-5 pb-[var(--safe-bottom)]">
        {/* 카카오 로그인 버튼 */}
        {isWebView() ? (
          <button
            onClick={handleKakaoLogin}
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
            onClick={handleAppleLogin}
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
