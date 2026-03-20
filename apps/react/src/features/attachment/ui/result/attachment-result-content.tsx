import { MemberDataLoveTypeCategoryEnum } from '@data/user-api-axios/api'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { Puzzle, Zap } from 'lucide-react'

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
import { usePersonalityFlow } from '@/features/profile/lib/personality-flow'
import { wrapWithTracking } from '@/shared/analytics'
import { BUTTON_NAMES, CATEGORIES } from '@/shared/analytics/constants'
import { Screen } from '@/shared/layout/screen'
import { cn } from '@/shared/lib/cn'
import { useGoBack } from '@/shared/navigation/use-go-back'
import loveTypeService from '@/shared/services/love-type.service'
import { Button } from '@/shared/ui'
import { DetailHeaderBar } from '@/shared/ui/header-bar'

import type { CSSProperties } from 'react'

interface UserInfo {
  nickname?: string
  loveTypeCategory?: string
  personalityType?: string
}

interface AttachmentResultContentProps {
  userInfo: UserInfo | null | undefined
  type: 'my' | 'partner'
  from?: 'home' | 'chat' | 'my-page'
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

export function AttachmentResultContent({ userInfo, type, from }: AttachmentResultContentProps) {
  const navigate = useNavigate()
  const { exit } = usePersonalityFlow()
  const isMyResult = type === 'my'
  const ctaText = from === 'chat' ? '상담하러 가기' : from === 'my-page' ? '마이페이지로 가기' : '홈으로 가기'
  const goBack = useGoBack()

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
            onClick={wrapWithTracking(BUTTON_NAMES.GO_HOME_FROM_RESULT, CATEGORIES.ATTACHMENT, () => exit())}
          />
        </div>
      </div>
    )
  }

  const isWarmType = loveTypeCatalogItem.isWarmType
  const personalityType = userInfo.personalityType?.toUpperCase() ?? ''
  const displayName = userInfo.nickname || (isMyResult ? '사용자' : '연인')
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
    goBack()
  }

  return (
    <Screen>
      <Screen.Content className="no-bounce-scroll flex flex-col bg-gray-neutral-50">
        <DetailHeaderBar className="bg-gray-neutral-50" onBackClick={handleClose} />

        <div className="px-4">
          <div className="relative">
            <div
              className="absolute inset-0 translate-x-[8px] translate-y-[8px] rounded-[28px]"
              style={{ backgroundColor: accentPalette.accentMutedBg }}
            />

            <section className="relative h-[400px] overflow-hidden rounded-[28px] bg-white shadow-[0_8px_24px_0_rgba(19,19,22,0.06)]">
              <img
                src={loveTypeCatalogItem.resultImage}
                alt={`${loveTypeCatalogItem.subtype} 결과 카드`}
                className="absolute inset-0 h-full w-full object-cover object-top"
              />
              <div className="absolute inset-x-0 top-0 h-[210px] bg-gradient-to-b from-white via-white/90 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 h-[96px] bg-gradient-to-t from-white/12 to-transparent" />

              <div className="absolute top-[22px] right-[22px] left-[22px] z-10">
                <p className={cn('heading2-bold', accentPalette.accentTextClass)}>{displayName}님은</p>
                <h1 className="title1-bold mt-2 text-gray-iron-900">{titleText}</h1>
                <p className="body3-medium mt-1 max-w-[230px] [word-break:keep-all] whitespace-pre-line text-gray-iron-900">
                  {summary}
                </p>
              </div>
            </section>
          </div>

          <div className="mt-6 space-y-6">
            <ResultKeywordSection keywords={keywords} />
            <ResultFeatureSection
              title={resolvedPersonalityType ? `${resolvedPersonalityType} 특징` : '애착유형 특징'}
              tabs={featureTabs}
            />
          </div>
        </div>

        <div className="mt-6 space-y-6 px-4">
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

        <ResultGuideSection accentPalette={accentPalette} isWarmType={isWarmType} guides={datingGuides} />

        <ResultMatchSection title={matchTitle} bestMatches={bestMatches} worstMatches={worstMatches} />

        <div className="mt-[92px] px-5 pb-[calc(var(--safe-bottom)_+_20px)]">
          <Button
            text={ctaText}
            className="h-[56px] rounded-[12px]"
            onClick={wrapWithTracking(BUTTON_NAMES.GO_HOME_FROM_RESULT, CATEGORIES.ATTACHMENT, exit)}
          />
        </div>
      </Screen.Content>
    </Screen>
  )
}
