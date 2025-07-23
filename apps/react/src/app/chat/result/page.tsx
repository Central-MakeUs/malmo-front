import { DetailHeaderBar } from '@/shared/components/header-bar'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { X } from 'lucide-react'
import { useChatResult } from '@/features/chat-result/hooks/use-chat-result'
import { ChatResultHeader, ChatResultMainInfo, ChatResultSummarySection } from '@/features/chat-result/ui'
import { Button } from '@/shared/ui'
import { z } from 'zod'

const searchSchema = z.object({
  chatId: z.number().optional(),
  fromHistory: z.boolean().optional(),
})

export const Route = createFileRoute('/chat/result/')({
  component: RouteComponent,
  validateSearch: searchSchema,
})

function RouteComponent() {
  const { chatId, fromHistory } = Route.useSearch()
  const { chatResult, summaryData, isLoading } = useChatResult(chatId)
  const navigate = useNavigate()

  const exitButton = () =>
    fromHistory ? (
      <p>삭제</p>
    ) : (
      <Link to="/">
        <X className="h-[24px] w-[24px]" />
      </Link>
    )

  if (isLoading || !chatResult) {
    return (
      <div className="flex h-full flex-col">
        <DetailHeaderBar right={exitButton()} showBackButton={fromHistory} className="bg-malmo-rasberry-25" />
        <div className="flex flex-1 items-center justify-center bg-white">
          <p className="body1-regular text-gray-500">요약 결과를 불러오는 중입니다...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <DetailHeaderBar right={exitButton()} showBackButton={fromHistory} className="bg-malmo-rasberry-25" />

      <div className="flex-1 overflow-y-auto bg-malmo-rasberry-25 pt-3">
        <ChatResultHeader
          title="대화 요약이 완료되었어요!"
          description={'모모가 고민을 해결하는 데<br /> 도움을 주었길 바라요'}
        />

        <div className="flex flex-col gap-7 rounded-t-[24px] bg-white px-5 py-10">
          <ChatResultMainInfo
            date={chatResult.createdAt}
            subject={chatResult.totalSummary}
            onViewChat={() => navigate({ to: '/chat', search: { chatId: chatResult.chatRoomId } })}
          />

          <hr className="border-gray-100" />

          {summaryData.map(({ title, content }) => (
            <ChatResultSummarySection key={title} title={title} content={content} />
          ))}

          <Button className="mt-13" text="홈으로 이동하기" onClick={() => navigate({ to: '/' })} />
        </div>
      </div>
    </div>
  )
}
