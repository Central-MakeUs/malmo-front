import { useLocation } from '@tanstack/react-router'
import { ChevronRightIcon } from 'lucide-react'
import { useState, useEffect } from 'react'

import bridge from '@/shared/bridge'
import { useIsFrozenRoute } from '@/shared/navigation/transition/route-phase-context'
import { Button } from '@/shared/ui'
import { FixedLayerPortal } from '@/shared/ui/fixed-layer'

export interface UseChattingModalReturn {
  chattingTutorialModal: () => React.ReactNode
  showChattingTutorial: boolean
}

export function useChattingModal(hasActiveChat?: boolean): UseChattingModalReturn {
  const { pathname } = useLocation()
  const isFrozenRoute = useIsFrozenRoute()

  const [showChattingTutorial, setShowChattingTutorial] = useState(false)

  useEffect(() => {
    if (pathname !== '/chat') return

    const fetchChatSeen = async () => {
      const seen = await bridge.getChatTutorialSeen()
      if (seen || hasActiveChat) {
        setShowChattingTutorial(false)
        return
      }

      setShowChattingTutorial(true)
    }

    fetchChatSeen()
  }, [hasActiveChat, pathname])

  const chattingTutorialModal = () => {
    const highlightedText = 'body2-medium text-malmo-rasberry-400'

    if (!showChattingTutorial || isFrozenRoute) {
      return null
    }

    return (
      <FixedLayerPortal>
        <div className="pointer-events-auto fixed inset-0 z-50 text-white">
          <div className="fixed inset-0 bg-black/80" />

          <div className="relative flex h-full w-full flex-col items-center justify-center">
            <div className="absolute top-[calc(var(--safe-top)-12px)] right-2 flex h-[72px] w-[72px] items-center justify-center rounded-full border-2 border-malmo-rasberry-500 bg-white">
              <p className="body2-semibold text-malmo-rasberry-500">나가기</p>
              <div className="absolute right-[72px] bottom-[-86px] h-[120px] w-[97px] border-t-2 border-l-2 border-dashed border-malmo-rasberry-400">
                <div className="absolute bottom-0 left-[-5px] h-2 w-2 rounded-full bg-malmo-rasberry-300" />
              </div>
            </div>

            <p className="absolute top-[calc(var(--safe-top)+160px)] text-center">
              1. 모모와 <span className={highlightedText}>대화를 나가고</span> 싶다면
              <span className={highlightedText}> 버튼</span>을 눌러주세요!
              <br />
              나갔다가 들어와도, <span className={highlightedText}>대화를 이어서</span> 할 수 있어요.
            </p>

            <div className="flex w-full flex-col items-center gap-[26px] px-5">
              <div className="relative flex w-full items-center justify-center rounded-[10px] bg-white px-[18px] py-[26px]">
                <div className="flex-1">
                  <p className="label1-medium mb-1 text-gray-iron-500">2025년 8월 23일</p>
                  <p className="font-bold text-gray-iron-950">
                    회피형 남자친구와의
                    <br />
                    연락문제
                  </p>
                </div>
                <div className="flex h-fit rounded-[7px] bg-gray-iron-700 py-[7px] pr-[10px] pl-[14px] text-white">
                  <p>대화보기</p>
                  <ChevronRightIcon />
                </div>
              </div>

              <div className="relative">
                <div className="absolute top-[-25px] left-0 h-[24px] w-[2px] bg-[repeating-linear-gradient(to_bottom,#ec5c7a_0_4px,transparent_4px_8px)]">
                  <div className="absolute bottom-0 left-[-3.5px] h-2 w-2 rounded-full bg-malmo-rasberry-300" />
                </div>
                <p className="mt-1">
                  2. 종료 후에는 모모와 나눈 <span className={highlightedText}>대화를 요약</span>해서 보여줘요.
                </p>
              </div>
            </div>

            {/* 하단 CTA: safe-bottom 위로 띄우기 */}
            <div className="absolute inset-x-0 bottom-[calc(var(--safe-bottom)+12px)] flex w-full gap-2 px-5">
              <Button text="확인" type="secondary" onClick={() => setShowChattingTutorial(false)} />
              <Button
                text="다시 보지 않기"
                onClick={() => {
                  bridge.saveChatTutorialSeen?.()
                  setShowChattingTutorial(false)
                }}
              />
            </div>
          </div>
        </div>
      </FixedLayerPortal>
    )
  }

  return {
    chattingTutorialModal,
    showChattingTutorial,
  }
}
