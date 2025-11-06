import { useQuery } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { X } from 'lucide-react'
import { useEffect } from 'react'
import { z } from 'zod'

import { ChatResultHeader, ChatResultMainInfo, ChatResultSummarySection } from '@/features/chat-result/ui'
import { useHistoryModal } from '@/features/history/hooks/use-history-modal'
import { wrapWithTracking } from '@/shared/analytics'
import { BUTTON_NAMES, CATEGORIES } from '@/shared/analytics/constants'
import { useTheme } from '@/shared/contexts/theme.context'
import { Screen } from '@/shared/layout/screen'
import { cn } from '@/shared/lib/cn'
import { useGoBack } from '@/shared/navigation/use-go-back'
import historyService from '@/shared/services/history.service'
import { Button } from '@/shared/ui'
import { DetailHeaderBar } from '@/shared/ui/header-bar'

const searchSchema = z.object({
  chatId: z.number(),
  fromHistory: z.boolean().optional(),
})

export const Route = createFileRoute('/chat/result/')({
  component: RouteComponent,
  validateSearch: searchSchema,
})

function RouteComponent() {
  const { chatId, fromHistory } = Route.useSearch()
  const historyModal = useHistoryModal()
  const { setStatusColor } = useTheme()
  const { data: chatResult } = useQuery(historyService.historySummaryQuery(chatId))
  const navigate = useNavigate()
  const goBack = useGoBack()

  useEffect(() => {
    setStatusColor('#FDEDF0')

    return () => {
      setStatusColor('#fff')
    }
  }, [])

  const summaryData = [
    { title: '상황 요약', content: chatResult?.firstSummary },
    { title: '관계 이해', content: chatResult?.secondSummary },
    { title: '해결 제안', content: chatResult?.thirdSummary },
  ]

  const exitButton = () =>
    fromHistory ? (
      <div
        onClick={wrapWithTracking(BUTTON_NAMES.DELETE_HISTORY, CATEGORIES.CHAT, () => {
          if (!chatId) return
          historyModal.deleteChatHistoryModal(chatId)
        })}
      >
        <p className="body2-medium text-gray-iron-700">{chatId ? '삭제' : '로딩중'}</p>
      </div>
    ) : (
      <button
        type="button"
        className="rounded border-none bg-transparent p-1 text-gray-iron-950"
        onClick={wrapWithTracking(BUTTON_NAMES.CLOSE_RESULT, CATEGORIES.CHAT, () => goBack())}
      >
        <X className="h-[24px] w-[24px]" />
      </button>
    )

  return (
    <Screen>
      <Screen.Header behavior="overlay">
        <DetailHeaderBar
          right={exitButton()}
          showBackButton={fromHistory}
          onBackClick={goBack}
          className="bg-malmo-rasberry-25"
        />
      </Screen.Header>

      <Screen.Content className="no-bounce-scroll flex flex-col bg-malmo-rasberry-25 pt-3">
        <ChatResultHeader
          title="대화 요약이 완료되었어요!"
          description={'모모가 고민을 해결하는 데<br /> 도움을 주었길 바라요'}
        />

        <div className={cn('rounded-t-[24px] bg-white px-5 pt-10', chatId ? 'pb-5' : 'pb-20')}>
          {!chatResult ? (
            <div className="flex flex-1 items-center justify-center bg-white">
              <p className="body1-regular text-gray-500">요약 결과를 불러오는 중입니다...</p>
            </div>
          ) : (
            <ChatResultMainInfo
              date={chatResult.createdAt}
              subject={chatResult.totalSummary}
              onViewChat={wrapWithTracking(BUTTON_NAMES.VIEW_CHAT, CATEGORIES.CHAT, () =>
                navigate({ to: '/chat', search: { chatId: chatResult.chatRoomId } })
              )}
            />
          )}

          <hr className="mt-7 border-gray-100" />

          <div className="mt-7 flex flex-col gap-9">
            {summaryData.map(({ title, content }) => (
              <ChatResultSummarySection
                key={title}
                title={title}
                content={content ? content : '진행하지 않은 단계에요.'}
              />
            ))}
          </div>

          {chatId && (
            <div className="mt-20">
              <Button
                text="홈으로 이동하기"
                onClick={wrapWithTracking(BUTTON_NAMES.GO_HOME_FROM_RESULT, CATEGORIES.CHAT, () => goBack())}
              />
            </div>
          )}
        </div>
      </Screen.Content>
    </Screen>
  )
}
