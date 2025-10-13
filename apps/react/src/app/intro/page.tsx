import { createFileRoute, useNavigate } from '@tanstack/react-router'
import React, { useState } from 'react'

import attachmentTypeImage from '@/assets/images/introduce/attachment-type.png'
import coupleConsultationImage from '@/assets/images/introduce/couple-consultation.png'
import dailyQuestionImage from '@/assets/images/introduce/daily-question.png'
import momoIntroImage from '@/assets/images/introduce/momo-intro.png'
import { wrapWithTracking } from '@/shared/analytics'
import { BUTTON_NAMES, CATEGORIES } from '@/shared/analytics/constants'
import { Button } from '@/shared/ui/button'
import { DetailHeaderBar } from '@/shared/ui/header-bar'

// 데이터 타입 정의
interface IntroPageData {
  image: string
  title: string
  description: string
}

// 데이터 정의
const introPages: IntroPageData[] = [
  {
    image: momoIntroImage,
    title: '말모는 성향 기반 상담으로\n관계 고민을 해결해요',
    description: '서로를 이해하고 고민을 해결할 수 있도록 도와요',
  },
  {
    image: attachmentTypeImage,
    title: '내 애착유형을 검사하고\n상대 유형도 함께 확인해요',
    description: '애착유형은 대표적인 관계 성향이에요',
  },
  {
    image: coupleConsultationImage,
    title: '애착유형을 바탕으로 \n어떤 연애 고민이든 상담해요',
    description: '상대의 애착유형을 몰라도 AI가 추측해 상담해요',
  },
  {
    image: dailyQuestionImage,
    title: '마음 질문으로 성향을 파악해\n더 정확한 상담을 제공해요',
    description: '마음 질문은 커플 연동 이후에 사용할 수 있어요',
  },
]

export const Route = createFileRoute('/intro/')({
  component: IntroPage,
})

function IntroPage() {
  const [currentPage, setCurrentPage] = useState(0)
  const navigate = useNavigate()

  // 현재 페이지 데이터
  const currentData = introPages[currentPage]
  const isLastPage = currentPage === introPages.length - 1

  // 데이터가 없는 경우 로딩 상태 또는 에러 처리
  if (!currentData) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div>잘못된 페이지입니다.</div>
      </div>
    )
  }

  // 다음 페이지로 이동
  const handleNext = wrapWithTracking(
    isLastPage ? BUTTON_NAMES.START_INTRO : BUTTON_NAMES.NEXT_INTRO,
    CATEGORIES.AUTH,
    () => {
      if (isLastPage) {
        // 마지막 페이지에서 완료 처리
        handleComplete()
      } else {
        setCurrentPage((prev) => prev + 1)
      }
    }
  )

  // 완료 처리
  const handleComplete = async () => {
    // 소개 후 자연스럽게 로그인으로 이동
    navigate({ to: '/login', replace: true })
  }

  // 건너뛰기
  const handleSkip = wrapWithTracking(BUTTON_NAMES.SKIP_INTRO, CATEGORIES.AUTH, handleComplete)

  const handlePrevious = wrapWithTracking(BUTTON_NAMES.PREV_INTRO, CATEGORIES.AUTH, () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1)
    }
  })

  return (
    <div className="flex h-full w-full flex-col bg-white">
      <DetailHeaderBar onBackClick={handlePrevious} showBackButton={currentPage > 0} />

      {/* 메인 콘텐츠 */}
      <div className="flex flex-1 flex-col justify-center">
        {/* 이미지 */}
        <div className="flex justify-center">
          <div className="h-[236px] w-[320px]">
            <img src={currentData.image} alt={currentData.title} className="h-full w-full object-contain" />
          </div>
        </div>

        {/* 타이틀 */}
        <h1 className="title2-bold mt-6 text-center text-gray-iron-950">
          {currentData.title.split('\n').map((line, index) => (
            <React.Fragment key={index}>
              {line}
              {index < currentData.title.split('\n').length - 1 && <br />}
            </React.Fragment>
          ))}
        </h1>

        {/* 설명 */}
        <p className="body2-medium mt-4 text-center text-gray-iron-400">
          {currentData.description.split('\n').map((line, index) => (
            <React.Fragment key={index}>
              {line}
              {index < currentData.description.split('\n').length - 1 && <br />}
            </React.Fragment>
          ))}
        </p>
      </div>

      {/* 하단 고정 영역 */}
      <div className="flex flex-col pb-[var(--safe-bottom)]">
        {/* 페이지 인디케이터 */}
        <div className="mb-8 flex justify-center space-x-2">
          {introPages.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full ${
                index === currentPage ? 'w-4 bg-malmo-rasberry-500' : 'w-2 bg-gray-neutral-200'
              }`}
            />
          ))}
        </div>

        {/* 다음/시작하기 버튼 */}
        <div className="mb-5 px-6">
          <Button text={isLastPage ? '시작하기' : '다음'} onClick={handleNext} className="w-full" />
        </div>

        {/* 건너뛰기 */}
        <div className="mb-5 flex justify-center">
          <button onClick={handleSkip} className="body3-medium text-gray-iron-400">
            건너뛰기
          </button>
        </div>
      </div>
    </div>
  )
}
