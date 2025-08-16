import { Link } from '@tanstack/react-router'

import momoChatting from '@/assets/images/momo-home-chatting.png'
import momoIdle from '@/assets/images/momo-home-idle.png'
import { cn } from '@/shared/lib/cn'

interface ChatEntryCardProps {
  isChatActive: boolean
}

export function ChatEntryCard({ isChatActive }: ChatEntryCardProps) {
  return (
    <>
      {/* 연애고민상담 타이틀 */}
      <h1 className="heading2-semibold text-gray-iron-950">연애 고민 상담</h1>

      {/* 연애고민상담 박스 */}
      <div className="mt-3 rounded-[10px] bg-malmo-rasberry-25 px-4 pt-4 pb-[18px]">
        <div className="flex h-full flex-col justify-between">
          {/* 상단 컨텐츠 */}
          <div className="flex items-start justify-between">
            {/* 뱃지 */}
            <div>
              <div
                className={cn(
                  'inline-flex rounded-lg px-[9px] py-[1px]',
                  isChatActive ? 'bg-white' : 'bg-malmo-rasberry-500'
                )}
              >
                <span className={cn('label1-semibold', isChatActive ? 'text-malmo-rasberry-500' : 'text-white')}>
                  {isChatActive ? 'CONTINUE' : 'START'}
                </span>
              </div>

              {/* 설명 */}
              <div className="mt-[5px] pl-[4px]">
                <p className="body2-semibold text-gray-iron-900">
                  모모와 연애 고민 상담을
                  <br />
                  {isChatActive ? '이어가 보세요' : '시작해 보세요'}
                </p>
              </div>
            </div>

            {/* 모모 이미지 */}
            <img src={isChatActive ? momoChatting : momoIdle} alt="모모" className="h-24 w-28" />
          </div>

          {/* 하단 버튼 */}
          <Link to="/chat">
            <button
              className={cn('h-[44px] w-full rounded-[32px]', isChatActive ? 'bg-malmo-rasberry-500' : 'bg-white')}
            >
              <span className={cn('body2-semibold', isChatActive ? 'text-white' : 'text-malmo-rasberry-500')}>
                {isChatActive ? '대화 이어서 하기' : '새 대화 시작하기'}
              </span>
            </button>
          </Link>
        </div>
      </div>
    </>
  )
}
