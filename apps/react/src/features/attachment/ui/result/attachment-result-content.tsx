import { MemberDataLoveTypeCategoryEnum } from '@data/user-api-axios/api'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { Puzzle, Zap } from 'lucide-react'
import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react'

import { getLoveTypeCatalogItem } from '@/features/attachment/models/love-type-catalog'
import type { AccentPalette } from '@/features/attachment/ui/result/attachment-result-sections'
import {
  ResultFeatureSection,
  ResultGuideSection,
  ResultKeywordSection,
  ResultMatchSection,
  ResultTextBlockSection,
  toFeatureTabs,
} from '@/features/attachment/ui/result/attachment-result-sections'
import { wrapWithTracking } from '@/shared/analytics'
import { BUTTON_NAMES, CATEGORIES } from '@/shared/analytics/constants'
import { Screen } from '@/shared/layout/screen'
import { cn } from '@/shared/lib/cn'
import { useGoBack } from '@/shared/navigation/use-go-back'
import loveTypeService from '@/shared/services/love-type.service'
import { Button } from '@/shared/ui'
import { DetailHeaderBar } from '@/shared/ui/header-bar'

interface UserInfo {
  nickname?: string
  loveTypeCategory?: string
  personalityType?: string
}

interface AttachmentResultContentProps {
  userInfo: UserInfo | null | undefined
  type: 'my' | 'partner'
  from?: 'home' | 'chat' | 'my-page' | 'my-result-preview' | 'partner-result-preview'
}
interface ResultDisplayMeta {
  accentPalette: AccentPalette
  titleText: string
  behaviorTitle: string
  typeFeatureTitle: string
  typeFeatureFixedEmojis: readonly string[]
  typeFeatureHeaderStyle: CSSProperties
  typeFeatureIconColorClass: string
  matchTitle: string
}

const STABLE_TYPE_FEATURE_EMOJIS = ['🤝', '💌', '💡', '🍀'] as const
const NON_STABLE_TYPE_FEATURE_EMOJIS = ['☠️', '💦', '🕳️', '🌀'] as const
const BEHAVIOR_PATTERN_EMOJIS = ['❤️', '🌟', '🤔', '💥'] as const
const RESULT_HERO_HEIGHT = 400
const RESULT_HERO_IMAGE_ASPECT_RATIO = 1029 / 1202
const RESULT_HERO_TEXT_HORIZONTAL_PADDING = 32
const RESULT_THEME: Record<
  'warm' | 'cool',
  {
    accentPalette: AccentPalette
    typeFeatureHeaderStyle: CSSProperties
    typeFeatureIconColorClass: string
  }
> = {
  warm: {
    accentPalette: {
      accentTextClass: 'text-malmo-orange-500',
      accentSoftBgClass: 'bg-malmo-orange-50',
      accentMutedBg: '#FFE2BB',
    },
    typeFeatureHeaderStyle: { background: 'linear-gradient(to top, #FFF1DE 0%, #FFFFFF 100%)' },
    typeFeatureIconColorClass: 'text-malmo-orange-100',
  },
  cool: {
    accentPalette: {
      accentTextClass: 'text-malmo-rasberry-500',
      accentSoftBgClass: 'bg-malmo-rasberry-50',
      accentMutedBg: '#FFC9D3',
    },
    typeFeatureHeaderStyle: { background: 'linear-gradient(to top, #FFE6E6 0%, #FFFFFF 100%)' },
    typeFeatureIconColorClass: 'text-malmo-rasberry-100',
  },
}

function getResultDisplayMeta({
  loveTypeCategory,
  subtype,
  personalityType,
  isWarmType,
}: {
  loveTypeCategory: string
  subtype: string
  personalityType: string
  isWarmType: boolean
}): ResultDisplayMeta {
  const theme = isWarmType ? RESULT_THEME.warm : RESULT_THEME.cool
  const hasPersonalityType = personalityType.length > 0

  return {
    accentPalette: theme.accentPalette,
    titleText: hasPersonalityType ? `${personalityType} ${subtype}` : subtype,
    behaviorTitle: hasPersonalityType ? `${personalityType}의 행동패턴` : `${subtype}의 행동패턴`,
    typeFeatureTitle: hasPersonalityType ? `${personalityType}가 ${subtype}일 때` : `${subtype}의 특징`,
    typeFeatureFixedEmojis:
      loveTypeCategory === MemberDataLoveTypeCategoryEnum.StableType
        ? STABLE_TYPE_FEATURE_EMOJIS
        : NON_STABLE_TYPE_FEATURE_EMOJIS,
    typeFeatureHeaderStyle: theme.typeFeatureHeaderStyle,
    typeFeatureIconColorClass: theme.typeFeatureIconColorClass,
    matchTitle: hasPersonalityType ? `${personalityType} ${subtype}의 연애 궁합` : `${subtype}의 연애 궁합`,
  }
}

export function AttachmentResultContent({ userInfo, type, from: _from }: AttachmentResultContentProps) {
  const navigate = useNavigate()
  const goBack = useGoBack()
  const contentRef = useRef<HTMLDivElement>(null)
  const heroSectionRef = useRef<HTMLElement>(null)
  const [heroHorizontalInset, setHeroHorizontalInset] = useState(RESULT_HERO_TEXT_HORIZONTAL_PADDING)
  const isMyResult = type === 'my'
  const ctaText = '상담하러 가기'

  useLayoutEffect(() => {
    const element = contentRef.current
    if (!element) return

    element.scrollTop = 0
    const frame = requestAnimationFrame(() => {
      element.scrollTop = 0
    })

    return () => cancelAnimationFrame(frame)
  }, [])

  useLayoutEffect(() => {
    const element = heroSectionRef.current
    if (!element) return

    const updateInset = () => {
      const containerWidth = element.clientWidth
      const renderedImageWidth = Math.min(containerWidth, RESULT_HERO_HEIGHT * RESULT_HERO_IMAGE_ASPECT_RATIO)
      const sideLetterbox = (containerWidth - renderedImageWidth) / 2
      const nextInset = sideLetterbox + RESULT_HERO_TEXT_HORIZONTAL_PADDING

      setHeroHorizontalInset((prev) => (Math.abs(prev - nextInset) < 0.5 ? prev : nextInset))
    }

    updateInset()

    const resizeObserver = new ResizeObserver(updateInset)
    resizeObserver.observe(element)

    return () => resizeObserver.disconnect()
  }, [])

  if (!userInfo?.loveTypeCategory) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-white">
        <div className="text-center">
          <p className="mb-4 text-gray-iron-600">
            {isMyResult ? '애착 검사 결과를 찾을 수 없습니다.' : '파트너의 검사 결과를 찾을 수 없습니다.'}
          </p>
          <Button
            text="홈으로 이동"
            onClick={wrapWithTracking(BUTTON_NAMES.GO_HOME_FROM_RESULT, CATEGORIES.ATTACHMENT, () =>
              navigate({ to: '/', replace: true })
            )}
          />
        </div>
      </div>
    )
  }

  const loveTypeCategory = userInfo.loveTypeCategory
  const loveTypeCatalogItem = getLoveTypeCatalogItem(loveTypeCategory)

  if (!loveTypeCatalogItem) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-white">
        <div className="text-center">
          <p className="mb-4 text-red-500">애착 유형 데이터를 찾을 수 없습니다.</p>
          <Button
            text="홈으로 이동"
            onClick={wrapWithTracking(BUTTON_NAMES.GO_HOME_FROM_RESULT, CATEGORIES.ATTACHMENT, () => goBack())}
          />
        </div>
      </div>
    )
  }

  const isWarmType = loveTypeCatalogItem.isWarmType
  const personalityType = userInfo.personalityType?.toUpperCase() ?? ''
  const displayName = userInfo.nickname || (isMyResult ? '사용자' : '상대')
  const shouldFetchDetail = personalityType.length > 0

  const { data: detailData } = useQuery({
    ...loveTypeService.detailQuery(personalityType, loveTypeCategory),
    enabled: shouldFetchDetail,
    retry: false,
    select: (response) => response?.data,
  })

  const resolvedPersonalityType = detailData?.personalityType ?? personalityType
  const summary = detailData?.summary ?? ''
  const keywords = detailData?.keywords ?? []
  const patterns = detailData?.patterns ?? []
  const loveTypeFeatures = detailData?.loveTypeFeatures ?? []
  const datingGuides = detailData?.datingGuides ?? []
  const bestMatches = detailData?.bestMatches ?? []
  const worstMatches = detailData?.worstMatches ?? []
  const featureTabs = toFeatureTabs(detailData?.strengths, detailData?.weaknesses)
  const {
    accentPalette,
    titleText,
    behaviorTitle,
    typeFeatureTitle,
    typeFeatureFixedEmojis,
    typeFeatureHeaderStyle,
    typeFeatureIconColorClass,
    matchTitle,
  } = getResultDisplayMeta({
    loveTypeCategory,
    subtype: loveTypeCatalogItem.subtype,
    personalityType: resolvedPersonalityType,
    isWarmType,
  })

  const handleClose = () => {
    navigate({ to: '/chat' })
  }

  return (
    <Screen>
      <Screen.Content ref={contentRef} className="no-bounce-scroll flex flex-col bg-gray-neutral-100">
        <DetailHeaderBar className="bg-gray-neutral-100" />

        <div className="px-4">
          <div className="relative">
            <section ref={heroSectionRef} className="relative h-[400px] w-full">
              <img
                src={loveTypeCatalogItem.resultImage}
                alt={`${loveTypeCatalogItem.subtype} 결과 카드`}
                className="absolute inset-0 h-full w-full object-contain object-center"
              />

              <div
                className="absolute top-[30px] z-10"
                style={{ left: `${heroHorizontalInset}px`, right: `${heroHorizontalInset}px` }}
              >
                <p className={cn('heading2-bold', accentPalette.accentTextClass)}>{displayName}님은</p>
                <h1 className="title1-bold mt-2 text-gray-iron-900">{titleText}</h1>
                <p className="body3-medium mt-1 max-w-[230px] [word-break:keep-all] whitespace-pre-line text-gray-iron-600">
                  {summary}
                </p>
              </div>
            </section>
          </div>

          <div className="mt-[24px] space-y-[24px]">
            <ResultKeywordSection keywords={keywords} />
            <ResultFeatureSection
              title={resolvedPersonalityType ? `${resolvedPersonalityType} 특징` : '애착유형 특징'}
              tabs={featureTabs}
            />
          </div>
        </div>

        <div className="mt-[24px] space-y-[24px] px-4">
          <ResultTextBlockSection
            title={behaviorTitle}
            accentPalette={accentPalette}
            decoration={
              <Puzzle
                className="h-[92px] w-[92px] text-gray-neutral-300"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth={1.6}
              />
            }
            headerStyle={{ background: 'linear-gradient(to top, #E5E7EB 0%, #FFFFFF 100%)' }}
            items={patterns}
            fixedEmojis={BEHAVIOR_PATTERN_EMOJIS}
          />

          <ResultTextBlockSection
            title={typeFeatureTitle}
            accentPalette={accentPalette}
            decoration={
              <Zap
                className={cn('h-[92px] w-[92px]', typeFeatureIconColorClass)}
                fill="currentColor"
                strokeWidth={1.75}
              />
            }
            items={loveTypeFeatures}
            fixedEmojis={typeFeatureFixedEmojis}
            headerStyle={typeFeatureHeaderStyle}
          />
        </div>

        <div className="mt-[40px] bg-white">
          <ResultGuideSection accentPalette={accentPalette} isWarmType={isWarmType} guides={datingGuides} />

          <ResultMatchSection title={matchTitle} bestMatches={bestMatches} worstMatches={worstMatches} />

          <div className="mt-[92px] px-5 pb-[calc(var(--safe-bottom)_+_20px)]">
            <Button
              text={ctaText}
              className="h-[56px] rounded-[12px]"
              onClick={wrapWithTracking(BUTTON_NAMES.GO_HOME_FROM_RESULT, CATEGORIES.ATTACHMENT, handleClose)}
            />
          </div>
        </div>
      </Screen.Content>
    </Screen>
  )
}
