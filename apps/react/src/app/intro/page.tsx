import { createFileRoute, useNavigate } from '@tanstack/react-router'
import React from 'react'
import z from 'zod'

import attachmentTypeImage from '@/assets/images/introduce/attachment-type.png'
import coupleConsultationImage from '@/assets/images/introduce/couple-consultation.png'
import dailyQuestionImage from '@/assets/images/introduce/daily-question.png'
import momoIntroImage from '@/assets/images/introduce/momo-intro.png'
import { wrapWithTracking } from '@/shared/analytics'
import { BUTTON_NAMES, CATEGORIES } from '@/shared/analytics/constants'
import { Screen } from '@/shared/layout/screen'
import { useGoBack } from '@/shared/navigation/use-go-back'
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

const searchSchema = z.object({
  step: z.number().int().min(0).catch(0),
})

export const Route = createFileRoute('/intro/')({
  validateSearch: searchSchema,
  component: IntroPage,
})

function IntroPage() {
  const navigate = useNavigate()
  const goBack = useGoBack()
  const { step } = Route.useSearch()
  const currentPage = Math.min(step ?? 0, introPages.length - 1)

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
        navigate({
          to: '/intro',
          search: (prev) => ({ ...prev, step: currentPage + 1 }),
        })
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
      // 이전 단계는 히스토리 pop으로 back 애니메이션
      goBack()
    } else {
      goBack()
    }
  })

  return (
    <Screen>
      <Screen.Header behavior="overlay">
        <DetailHeaderBar onBackClick={handlePrevious} showBackButton={true} />
      </Screen.Header>

      <Screen.Content className="flex flex-1 flex-col bg-white">
        <div className="flex flex-1 flex-col justify-center">
          <div className="flex justify-center">
            <div className="h-[236px] w-[320px]">
              <img src={currentData.image} alt={currentData.title} className="h-full w-full object-contain" />
            </div>
          </div>

          <h1 className="title2-bold mt-6 text-center text-gray-iron-950">
            {currentData.title.split('\n').map((line, index) => (
              <React.Fragment key={index}>
                {line}
                {index < currentData.title.split('\n').length - 1 && <br />}
              </React.Fragment>
            ))}
          </h1>

          <p className="body2-medium mt-4 text-center text-gray-iron-400">
            {currentData.description.split('\n').map((line, index) => (
              <React.Fragment key={index}>
                {line}
                {index < currentData.description.split('\n').length - 1 && <br />}
              </React.Fragment>
            ))}
          </p>
        </div>

        <div className="flex flex-col pb-[var(--safe-bottom)]">
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

          <div className="mb-5 px-6">
            <Button text={isLastPage ? '시작하기' : '다음'} onClick={handleNext} className="w-full" />
          </div>

          <div className="mb-5 flex justify-center">
            <button onClick={handleSkip} className="body3-medium text-gray-iron-400">
              건너뛰기
            </button>
          </div>
        </div>
      </Screen.Content>
    </Screen>
  )
}
