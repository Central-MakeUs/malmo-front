import React from 'react'
import momoErrorImage from '@/assets/images/momo-error.png'
import { DetailHeaderBar } from '@/shared/components/header-bar'

interface RouterErrorProps {
  error?: Error
}

export function RouterError({ error }: RouterErrorProps) {
  // 401 에러는 로그인 페이지로 리다이렉트
  if (error?.message?.includes('401') || error?.message?.includes('Unauthorized')) {
    window.location.href = '/login'
    return null
  }

  const handleGoHome = () => {
    window.location.href = '/'
  }

  return (
    <div className="flex h-screen flex-col bg-white">
      {/* 헤더 네비게이션바 */}
      <DetailHeaderBar showBackButton={true} />

      {/* 컨텐츠 */}
      <div className="mt-[106px] flex flex-1 flex-col items-center px-5">
        {/* 에러 이미지 */}
        <img src={momoErrorImage} alt="에러 이미지" className="h-[236px] w-[320px] object-contain" />

        {/* 제목 */}
        <h1 className="heading1-bold mt-6 text-gray-iron-950">일시적인 오류가 발생했어요</h1>

        {/* 설명 */}
        <p className="body2-medium mt-1 text-gray-iron-500">잠시 후에 다시 시도해 주세요!</p>

        <div className="flex-1" />

        {/* 버튼 */}
        <div className="mb-5 w-full">
          <button
            onClick={handleGoHome}
            className="body1-semibold h-[54px] w-full rounded-lg bg-gray-iron-700 text-white"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  )
}
