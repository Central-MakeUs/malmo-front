import { useEffect } from 'react'

import momoErrorImage from '@/assets/images/momo-error.png'
import { ErrorReporter } from '@/shared/analytics'
import { Screen } from '@/shared/layout/screen'
import { DetailHeaderBar } from '@/shared/ui/header-bar'

interface RouterErrorProps {
  error?: Error
}

export function RouterError({ error }: RouterErrorProps) {
  useEffect(() => {
    // 통합 에러 리포팅
    if (error) {
      ErrorReporter.report(error, {
        source: 'router',
        route: window.location.pathname,
        severity: 'high',
        userAgent: navigator.userAgent,
      })
    }
  }, [error])

  // 401 에러는 로그인 페이지로 리다이렉트
  if (error?.message?.includes('401') || error?.message?.includes('Unauthorized')) {
    window.location.href = '/login'
    return null
  }

  const handleGoHome = () => {
    window.location.href = '/'
  }

  return (
    <Screen>
      <Screen.Header className="bg-white">
        <DetailHeaderBar showBackButton={true} />
      </Screen.Header>

      <Screen.Content className="flex flex-col items-center justify-between px-5">
        <div className="mt-[106px] flex flex-col items-center">
          <img src={momoErrorImage} alt="에러 이미지" className="h-[236px] w-[320px] object-contain" />
          <h1 className="heading1-bold mt-6 text-gray-iron-950">일시적인 오류가 발생했어요</h1>
          <p className="body2-medium mt-1 text-gray-iron-500">잠시 후에 다시 시도해 주세요!</p>
        </div>

        <div className="w-full pb-5">
          <button
            onClick={handleGoHome}
            className="body1-semibold h-[54px] w-full rounded-lg bg-gray-iron-700 text-white"
          >
            홈으로 돌아가기
          </button>
        </div>
      </Screen.Content>
    </Screen>
  )
}
