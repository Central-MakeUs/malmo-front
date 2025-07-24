import { HomeHeaderBar } from '@/shared/components/header-bar'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ChevronRight, LucideSearch } from 'lucide-react'
import emptyImage from '@/assets/images/onboarding-end.png'
import ChatBubble from '@/assets/icons/chat.svg'
import { cn } from '@ui/common/lib/utils'
import { useChatHistory } from '@/features/history/context/chat-history-context'
import { ChatRoomStateDataChatRoomStateEnum, GetChatRoomListResponse } from '@data/user-api-axios/api'
import { formatDate } from '@/shared/utils'
import { useChatRoomStatusQuery } from '@/features/chat/hook/use-chat-queries'

export const Route = createFileRoute('/chat/history/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { chatHistory } = useChatHistory()
  const { data: chatStatus } = useChatRoomStatusQuery()
  const activeChat =
    chatStatus === ChatRoomStateDataChatRoomStateEnum.NeedNextQuestion ||
    chatStatus === ChatRoomStateDataChatRoomStateEnum.Alive

  const ChatHistoryItem = ({ history }: { history: GetChatRoomListResponse }) => (
    <Link
      className="mb-[6px] flex items-center justify-between bg-white px-5 py-6"
      to={'/chat/result'}
      search={{ chatId: history.chatRoomId, fromHistory: true }}
    >
      <div>
        <div className="mb-[10px] flex gap-1">
          <div className="rounded-[8px] bg-malmo-rasberry-25 px-[9px] py-[1px]">
            <p className="label1-semibold text-malmo-rasberry-500">{history.situationKeyword}</p>
          </div>
          <div className="rounded-[8px] bg-malmo-orange-50 px-[9px] py-[1px]">
            <p className="label1-semibold text-malmo-orange-500">{history.solutionKeyword}</p>
          </div>
        </div>
        <div className="pl-1">
          <p className="label1-medium text-gray-iron-500">{formatDate(history.createdAt, 'YYYY년 MM월 DD일')}</p>
          <h1 className="body1-semibold">{history.totalSummary}</h1>
        </div>
      </div>
      <ChevronRight size={24} />
    </Link>
  )

  const EmptyItem = () => (
    <div>
      <img src={emptyImage} alt="Empty State" className="mb-5 px-[28px] pt-11" />
      <div className="text-center">
        <p className="heading1-bold mb-1">아직 대화 기록이 없어요</p>
        <p className="body2-medium text-gray-iron-500">모모에게 고민을 이야기해 보세요!</p>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen flex-col">
      <HomeHeaderBar title="대화 기록" right={<p className="body2-medium text-gray-iron-700">삭제</p>} />

      <div className="px-5 pb-3">
        <div className="flex items-center gap-3 rounded-[42px] bg-gray-neutral-100 px-4 py-[13px]">
          <LucideSearch size={20} className="text-gray-iron-400" />
          <input
            type="text"
            placeholder="찾고싶은 대화 제목을 검색해보세요."
            className="w-full bg-transparent text-gray-iron-900 placeholder:text-gray-iron-400 focus:outline-none"
          />
        </div>
      </div>

      <section className="flex-1 bg-gray-neutral-100">
        {chatHistory.length > 0 ? (
          chatHistory.map((history) => <ChatHistoryItem key={history.chatRoomId} history={history} />)
        ) : (
          <EmptyItem />
        )}

        <Link to={'/chat'}>
          <div className="fixed right-5 bottom-6 flex h-[52px] w-[52px] items-center justify-center rounded-full bg-gray-iron-700">
            <div
              className={cn(
                'absolute top-[-42px] right-0 rounded-[17.5px] bg-gray-iron-900 px-4 py-[6px] whitespace-nowrap',
                "before:absolute before:right-[18px] before:bottom-[-4.5px] before:h-3 before:w-3 before:-translate-x-1/2 before:rotate-45 before:rounded-sm before:bg-inherit before:content-['']"
              )}
            >
              <p className="label1-medium text-gray-iron-200">
                {activeChat ? '진행 중인 대화가 있어요!' : '모모와 고민 상담하러 가기'}
              </p>
            </div>
            <ChatBubble className="h-6 w-6" />
          </div>
        </Link>
      </section>
    </div>
  )
}
