import { DetailHeaderBar } from '@/shared/components/header-bar'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { X } from 'lucide-react'
import { ChatResultHeader, ChatResultMainInfo, ChatResultSummarySection } from '@/features/chat-result/ui'
import { Button } from '@/shared/ui'
import { z } from 'zod'
import { useChatting } from '@/features/chat/context/chatting-context'
import historyService from '@/shared/services/history.service'
import { useEffect } from 'react'
import bridge from '@/shared/bridge'

const searchSchema = z.object({
  chatId: z.number().optional(),
  fromHistory: z.boolean().optional(),
})

export const Route = createFileRoute('/chat/result/')({
  component: RouteComponent,
  validateSearch: searchSchema,
  loaderDeps: (search) => search,
  loader: async ({ context, deps }) => {
    const { data } = await historyService.getChatroomSummary(deps.search.chatId ?? 0)

    return { chatResult: data }
  },
})

function RouteComponent() {
  const { chatResult } = Route.useLoaderData()
  const { chatId, fromHistory } = Route.useSearch()
  const { chattingModal } = useChatting()

  const navigate = useNavigate()

  useEffect(() => {
    bridge.changeStatusBarColor('#FDEDF0')

    return () => {
      bridge.changeStatusBarColor('#fff')
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
        onClick={() => {
          if (!chatId) return
          chattingModal.deleteChatHistoryModal(chatId)
        }}
      >
        <p className="body2-medium text-gray-iron-700">{chatId ? '삭제' : '로딩중'}</p>
      </div>
    ) : (
      <Link to="/">
        <X className="h-[24px] w-[24px]" />
      </Link>
    )

  return (
    <div className="flex h-full flex-col pt-[50px]">
      <DetailHeaderBar right={exitButton()} showBackButton={fromHistory} className="fixed top-0 bg-malmo-rasberry-25" />

      <div className="flex-1 bg-malmo-rasberry-25 pt-3">
        <ChatResultHeader
          title="대화 요약이 완료되었어요!"
          description={'모모가 고민을 해결하는 데<br /> 도움을 주었길 바라요'}
        />

        <div className="flex flex-col gap-7 rounded-t-[24px] bg-white px-5 py-10">
          {!chatResult ? (
            <div className="flex flex-1 items-center justify-center bg-white">
              <p className="body1-regular text-gray-500">요약 결과를 불러오는 중입니다...</p>
            </div>
          ) : (
            <ChatResultMainInfo
              date={chatResult.createdAt}
              subject={chatResult.totalSummary}
              onViewChat={() => navigate({ to: '/chat', search: { chatId: chatResult.chatRoomId } })}
            />
          )}

          <hr className="border-gray-100" />

          {summaryData.map(({ title, content }) => (
            <ChatResultSummarySection
              key={title}
              title={title}
              content={content ? content : '진행하지 않은 단계에요.'}
            />
          ))}

          <Button className="mt-13" text="홈으로 이동하기" onClick={() => navigate({ to: '/' })} />
        </div>
      </div>
    </div>
  )
}
