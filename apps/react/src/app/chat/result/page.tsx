import { DetailHeaderBar } from '@/shared/components/header-bar'
import { createFileRoute, Link } from '@tanstack/react-router'
import { X } from 'lucide-react'
import { useChatResult } from '@/features/chat-result/hooks/use-chat-result'
import { ChatResultHeader, ChatResultMainInfo, ChatResultSummarySection } from '@/features/chat-result/ui'
import { Button } from '@/shared/ui'

export const Route = createFileRoute('/chat/result/')({
  component: RouteComponent,
})

function RouteComponent() {
  const chatResult = useChatResult()

  const exitButton = () => (
    <Link to="/">
      <X className="h-[24px] w-[24px]" />
    </Link>
  )

  return (
    <div className="flex h-full flex-col">
      <DetailHeaderBar right={exitButton()} allowBack={false} className="bg-malmo-rasberry-25" />

      <div className="bg-malmo-rasberry-25 pt-3">
        <ChatResultHeader
          title="대화 요약이 완료되었어요!"
          description={'모모가 고민을 해결하는 데<br /> 도움을 주었길 바라요'}
        />

        <div className="flex flex-col gap-7 rounded-t-[24px] bg-white px-5 py-10">
          <ChatResultMainInfo date={chatResult.date} subject={chatResult.subject} onViewChat={() => {}} />

          <hr className="border-gray-100" />

          <ChatResultSummarySection title="상황 요약" content={chatResult.summary} />
          <ChatResultSummarySection title="관계 이해" content={chatResult.relation} />
          <ChatResultSummarySection title="해결 제안" content={chatResult.solution} />

          <Link to="/" className="mt-13">
            <Button text="홈으로 이동하기" onClick={() => {}} />
          </Link>
        </div>
      </div>
    </div>
  )
}
