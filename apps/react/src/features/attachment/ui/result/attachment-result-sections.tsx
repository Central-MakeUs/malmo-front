import { Check } from 'lucide-react'
import { useState } from 'react'

import HeartIcon from '@/assets/icons/heart.svg'
import { toAttachmentResultEmoji, toAttachmentResultLabel } from '@/features/attachment/models/result-label-map'
import { cn } from '@/shared/lib/cn'

import type { LoveTypePersonalityTypeBlockData, LoveTypeTextBlockData } from '@data/user-api-axios/api'
import type { CSSProperties, ReactNode } from 'react'

export interface ResultTabItem {
  label: string
  title: string
  description: string
}

export interface AccentPalette {
  accentTextClass: string
  accentSoftBgClass: string
  accentMutedBg: string
}

const FEATURE_POINT_EMOJIS = ['🤩', '😀', '😮', '😥'] as const
const FEATURE_BAR_HEIGHTS = [120, 100, 72, 20] as const
const FEATURE_CHART_GRADIENTS = [
  'linear-gradient(180deg, #FFC9D3 0%, #FFE6EB 100%)',
  'linear-gradient(180deg, #FFE2BB 0%, #FFF0DB 100%)',
  'linear-gradient(180deg, #E1D7FF 0%, #F0EBFF 100%)',
  'linear-gradient(180deg, #B0B6BF 0%, #C8CBD0 100%)',
] as const
const FEATURE_BAR_TOP_COLORS = ['#EC4665', '#FF8400', '#7C59EA', '#3F3F46'] as const
const FEATURE_LABEL_BG_CLASSES = [
  'bg-malmo-rasberry-500',
  'bg-malmo-orange-500',
  'bg-malmo-purple-500',
  'bg-gray-iron-700',
] as const
const BEST_MATCH_CARD_BG = '#FDEDF0'
const WORST_MATCH_CARD_BG = '#F3F4F6'
const SECOND_GUIDE_CHECK_GRADIENT = 'linear-gradient(180deg, #9DA4AE 0%, #C8CFD8 100%)'

function pickByIndex<T>(values: readonly T[], index: number): T {
  return values[Math.min(index, values.length - 1)] as T
}

export function toFeatureTabs(
  strengths: LoveTypeTextBlockData[] | undefined,
  weaknesses: LoveTypeTextBlockData[] | undefined
): ResultTabItem[] {
  const strengthItems = (strengths ?? []).slice(0, 3).map((item, index) => ({
    label: `강점 ${index + 1}`,
    title: item.title ?? '',
    description: item.description ?? '',
  }))

  const weakness = weaknesses?.[0]
  if (!weakness) return strengthItems

  return [
    ...strengthItems,
    {
      label: '약점',
      title: weakness.title ?? '',
      description: weakness.description ?? '',
    },
  ]
}

export function ResultKeywordSection({ keywords }: { keywords: string[] }) {
  return (
    <section className="rounded-[24px] bg-white p-5">
      <h2 className="heading2-bold text-gray-iron-800">나의 키워드</h2>

      <div className="mt-2 flex flex-nowrap gap-[3px] overflow-x-auto pb-[2px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {keywords.map((keyword, index) => {
          const label = toAttachmentResultLabel(keyword)

          return (
            <div
              key={`${keyword}-${index}`}
              className="inline-flex shrink-0 items-center gap-[3px] rounded-full bg-gray-iron-800 px-[9px] py-[3px]"
            >
              <span className="body4-medium text-white">{label}</span>
              <span className="emoji-toss flex h-4 w-4 items-center justify-center text-[13px] leading-none">
                {toAttachmentResultEmoji(keyword)}
              </span>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export function ResultFeatureSection({ title, tabs }: { title: string; tabs: ResultTabItem[] }) {
  if (!tabs.length) return null

  const [selectedIndex, setSelectedIndex] = useState(0)
  const activeTab = tabs[selectedIndex]

  return (
    <section className="rounded-[24px] bg-white px-5 pt-5 pb-6">
      <h2 className="heading2-bold text-gray-iron-800">{title}</h2>

      <div className="mt-6 rounded-[18.5px] bg-gray-neutral-100 p-1">
        <div className="flex gap-1">
          {tabs.map((tab, index) => {
            const isSelected = index === selectedIndex

            return (
              <button
                key={tab.label}
                type="button"
                onClick={() => setSelectedIndex(index)}
                className={cn(
                  'flex-1 rounded-[50px] px-[14px] py-[7px] text-center',
                  isSelected ? 'bg-white shadow-[0_1px_4px_0_rgba(0,0,0,0.08)]' : 'bg-transparent'
                )}
              >
                <span
                  className={cn(isSelected ? 'body4-semibold text-gray-iron-800' : 'body4-medium text-gray-iron-800')}
                >
                  {tab.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-5">
        <div className="mx-auto grid w-full max-w-[288px] grid-cols-4 gap-4">
          {tabs.map((tab, index) => {
            const isSelected = index === selectedIndex
            const selectedGradient = pickByIndex(FEATURE_CHART_GRADIENTS, index)
            const selectedTopColor = pickByIndex(FEATURE_BAR_TOP_COLORS, index)

            return (
              <button
                key={`bar-${tab.label}`}
                type="button"
                onClick={() => setSelectedIndex(index)}
                className="flex h-[120px] w-full items-end"
              >
                <div className="relative w-full" style={{ height: `${pickByIndex(FEATURE_BAR_HEIGHTS, index)}px` }}>
                  {isSelected && (
                    <div
                      className="absolute -top-[2px] left-0 h-[2px] w-full rounded-[10px]"
                      style={{ background: selectedTopColor }}
                    />
                  )}
                  <div
                    className="h-full w-full transition-[background,border-radius]"
                    style={{
                      background: isSelected ? selectedGradient : '#E5E7EB',
                      borderTopLeftRadius: isSelected ? '0px' : '8px',
                      borderTopRightRadius: isSelected ? '0px' : '8px',
                    }}
                  />
                </div>
              </button>
            )
          })}
        </div>

        <div className="mx-auto h-[1px] w-full max-w-[288px] bg-gray-neutral-300" />

        <div className="mx-auto mt-2 grid w-full max-w-[288px] grid-cols-4 gap-4">
          {tabs.map((tab, index) => {
            const isSelected = index === selectedIndex
            const selectedLabelBgClass = pickByIndex(FEATURE_LABEL_BG_CLASSES, index)

            return (
              <button
                key={`label-${tab.label}`}
                type="button"
                onClick={() => setSelectedIndex(index)}
                className="flex w-full flex-col items-center"
              >
                <span className="emoji-toss inline-flex h-7 w-7 items-center justify-center text-[28px] leading-none">
                  {FEATURE_POINT_EMOJIS[index % FEATURE_POINT_EMOJIS.length]}
                </span>

                <div
                  className={cn(
                    'mt-2 flex w-full items-center justify-center rounded-[8px] px-[7.5px] py-[1px] text-center',
                    isSelected ? `${selectedLabelBgClass} text-white` : 'bg-gray-neutral-100 text-gray-iron-500'
                  )}
                >
                  <span className={cn(isSelected ? 'body4-semibold' : 'body4-medium')}>
                    {toAttachmentResultLabel(tab.title)}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {activeTab && (
        <div className="mt-5 rounded-[12px] bg-gray-neutral-100 px-4 py-[10px]">
          <p className="body3-regular [word-break:keep-all] text-gray-iron-800">
            {toAttachmentResultLabel(activeTab.description)}
          </p>
        </div>
      )}
    </section>
  )
}

export function ResultTextBlockSection({
  title,
  accentPalette,
  decoration,
  items,
  fixedEmojis,
  headerStyle,
}: {
  title: string
  accentPalette: AccentPalette
  decoration: ReactNode
  items: LoveTypeTextBlockData[]
  fixedEmojis: readonly string[]
  headerStyle?: CSSProperties
}) {
  if (!items.length) return null

  return (
    <section className="overflow-hidden rounded-[24px] bg-white">
      <div className={cn('relative h-[120px]', !headerStyle && accentPalette.accentSoftBgClass)} style={headerStyle}>
        <h2 className="heading2-bold absolute top-5 left-5 text-gray-iron-800">{title}</h2>
        <span className="absolute top-[43px] right-6 z-0 inline-flex h-[92px] w-[92px] items-center justify-center">
          {decoration}
        </span>
      </div>

      <div className="relative z-10 bg-white px-5 pt-8 pb-8">
        <div className="space-y-[36px]">
          {items.map((item, index) => (
            <div key={`${item.title || 'item'}-${index}`}>
              <div className="flex items-start gap-2">
                <span className="emoji-toss flex h-6 w-6 shrink-0 items-center justify-center text-[24px] leading-none">
                  {fixedEmojis[index % fixedEmojis.length]}
                </span>
                <p className="body1-semibold text-gray-iron-900">{toAttachmentResultLabel(item.title)}</p>
              </div>
              <p className="body2-regular mt-3 [word-break:keep-all] text-gray-iron-600">
                {toAttachmentResultLabel(item.description)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function ResultGuideSection({
  accentPalette,
  isWarmType,
  guides,
}: {
  accentPalette: AccentPalette
  isWarmType: boolean
  guides: LoveTypeTextBlockData[]
}) {
  if (!guides.length) return null

  const guideCheckGradient = isWarmType
    ? 'linear-gradient(180deg, #FF8400 0%, #FFC17F 100%)'
    : 'linear-gradient(180deg, #EC4665 0%, #F78EA2 100%)'

  return (
    <section className="px-5 pt-12">
      <h2 className="heading2-bold text-gray-iron-800">건강한 연애를 위한 가이드</h2>

      <div className="mt-6 grid gap-3">
        {guides.slice(0, 3).map((guide, index) => {
          const title = toAttachmentResultLabel(guide.title)
          const description = toAttachmentResultLabel(guide.description)

          return (
            <div
              key={`${title}-${index}`}
              className={cn(
                'flex min-h-24 items-center rounded-[16px] px-5',
                index === 1 ? 'bg-gray-neutral-100' : accentPalette.accentSoftBgClass
              )}
            >
              <div
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
                style={{ background: index === 1 ? SECOND_GUIDE_CHECK_GRADIENT : guideCheckGradient }}
              >
                <Check className="h-4 w-4 stroke-[2.6] text-white" />
              </div>

              <div className="ml-4">
                <p className="body1-semibold text-gray-iron-900">{title}</p>
                <p className="body3-regular mt-1 [word-break:keep-all] text-gray-iron-700">{description}</p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

function MatchCard({ item, tone }: { item: LoveTypePersonalityTypeBlockData; tone: 'best' | 'worst' }) {
  const matchCardBackground = tone === 'best' ? BEST_MATCH_CARD_BG : WORST_MATCH_CARD_BG

  return (
    <div className="h-[182px] rounded-[16px] p-4" style={{ background: matchCardBackground }}>
      <HeartIcon className={cn('h-5 w-5', tone === 'best' ? '[&_path]:fill-[#EC4665]' : '[&_path]:fill-[#4E5968]')} />
      <p className={cn('title2-bold mt-2', tone === 'best' ? 'text-malmo-rasberry-500' : 'text-gray-iron-800')}>
        {toAttachmentResultLabel(item.personalityType)}
      </p>
      <p className="body3-regular mt-2 [word-break:keep-all] text-gray-iron-800">
        {toAttachmentResultLabel(item.description)}
      </p>
    </div>
  )
}

export function ResultMatchSection({
  title,
  bestMatches,
  worstMatches,
}: {
  title: string
  bestMatches: LoveTypePersonalityTypeBlockData[]
  worstMatches: LoveTypePersonalityTypeBlockData[]
}) {
  if (!bestMatches.length && !worstMatches.length) return null

  return (
    <section className="px-5 pt-[100px]">
      <h2 className="heading2-bold text-center text-gray-iron-800">{title}</h2>

      {bestMatches.length > 0 && (
        <>
          <div className="mt-8 flex justify-center">
            <div className="rounded-full bg-malmo-rasberry-500 px-[14px] py-[1px]">
              <span className="body3-semibold text-white">BEST</span>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            {bestMatches.slice(0, 2).map((item, index) => (
              <MatchCard key={`${item.personalityType || 'best'}-${index}`} item={item} tone="best" />
            ))}
          </div>
        </>
      )}

      {worstMatches.length > 0 && (
        <>
          <div className="mt-6 flex justify-center">
            <div className="rounded-full bg-gray-iron-700 px-[14px] py-[1px]">
              <span className="body3-semibold text-white">WORST</span>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            {worstMatches.slice(0, 2).map((item, index) => (
              <MatchCard key={`${item.personalityType || 'worst'}-${index}`} item={item} tone="worst" />
            ))}
          </div>
        </>
      )}
    </section>
  )
}
