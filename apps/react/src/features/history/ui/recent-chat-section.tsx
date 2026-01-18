import { GetChatRoomListResponse } from '@data/user-api-axios/api'
import { Link } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'

import ChatFilledIcon from '@/assets/icons/chat-current.svg'
import ChatIcon from '@/assets/icons/chat-gray.svg'
import { cn } from '@/shared/lib/cn'
import { formatDate } from '@/shared/utils/date'

interface RecentChatSectionProps {
  histories: GetChatRoomListResponse[]
  totalHistoryCount: number
}

export function RecentChatSection({ histories, totalHistoryCount }: RecentChatSectionProps) {
  const visibleHistories = histories.slice(0, 2)
  const showEmptyHistory = totalHistoryCount === 0
  const showHistoryPlaceholder = totalHistoryCount === 1
  const showMoreHistoryButton = totalHistoryCount >= 3

  return (
    <section className="mt-8">
      <h2 className="heading2-semibold text-gray-iron-950">최근 대화 목록</h2>
      <div
        className={cn(
          'mt-3 rounded-[10px] border border-gray-iron-200',
          showEmptyHistory ? 'px-5 py-12' : 'py-5 pr-[14px] pl-4'
        )}
      >
        {showEmptyHistory ? (
          <div className="flex flex-col items-center text-center">
            <p className="body2-medium text-gray-iron-700">최근 대화 기록이 없어요</p>
            <Link
              to="/tutorial"
              className="mt-2 flex items-center gap-[6px] rounded-[8px] bg-gray-neutral-100 px-4 py-2"
            >
              <ChatIcon className="h-5 w-5 text-gray-iron-700" style={{ transform: 'scaleX(-1)' }} />
              <span className="body3-semibold text-gray-iron-700">상담 튜토리얼 보러가기</span>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col">
            {visibleHistories.map((history, index) => (
              <div key={history.chatRoomId ?? index}>
                <Link
                  to="/chat/result"
                  search={{ chatId: history.chatRoomId!, fromHistory: true }}
                  className="flex items-center justify-between"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-malmo-rasberry-10">
                      <ChatFilledIcon className="h-6 w-6 text-malmo-rasberry-500" style={{ transform: 'scaleX(-1)' }} />
                    </div>
                    <div className="min-w-0">
                      <p className="body2-semibold truncate text-gray-iron-800">{history.totalSummary}</p>
                      <p className="label1-medium text-gray-iron-500">
                        {formatDate(history.createdAt, 'YYYY년 M월 D일')}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="ml-3 h-5 w-5 text-gray-iron-500" />
                </Link>
                {(index < visibleHistories.length - 1 || showHistoryPlaceholder) && (
                  <div className="my-[18px]">
                    <hr className="h-px border-0 bg-gray-iron-100" />
                  </div>
                )}
                {showHistoryPlaceholder && index === visibleHistories.length - 1 && (
                  <Link to="/chat" className="flex items-center gap-3">
                    <div className="h-11 w-11 shrink-0 rounded-full bg-gray-neutral-100" />
                    <div>
                      <p className="body2-semibold text-gray-iron-400">새 대화를 시작해보세요</p>
                      <p className="label1-medium text-gray-iron-400">아직 2번째 대화가 시작되지 않았어요</p>
                    </div>
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      {showMoreHistoryButton && (
        <div className="mt-2 flex">
          <Link to="/history" className="flex w-full justify-center rounded-[8px] bg-gray-neutral-100 px-4 py-2">
            <span className="body4-medium text-gray-iron-800">대화기록 더보기</span>
          </Link>
        </div>
      )}
    </section>
  )
}
