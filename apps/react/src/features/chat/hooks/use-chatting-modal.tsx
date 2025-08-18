import { ChatRoomStateDataChatRoomStateEnum } from '@data/user-api-axios/api'
import { useQueryClient } from '@tanstack/react-query'
import { useLocation, useRouter } from '@tanstack/react-router'
import { ChevronRightIcon } from 'lucide-react'
import { useState, useEffect } from 'react'

import { useAuth } from '@/features/auth'
import bridge from '@/shared/bridge'
import { useAlertDialog } from '@/shared/hooks/use-alert-dialog'
import chatService from '@/shared/services/chat.service'
import { Button } from '@/shared/ui'

export interface UseChattingModalReturn {
  testRequiredModal: () => void
  exitChattingModal: () => void
  chattingTutorialModal: () => React.ReactNode
  showChattingTutorial: boolean
}

export function useChattingModal(chatStatus?: ChatRoomStateDataChatRoomStateEnum): UseChattingModalReturn {
  const alertDialog = useAlertDialog()
  const router = useRouter()
  const queryClient = useQueryClient()
  const { pathname } = useLocation()
  const auth = useAuth()

  const [showChattingTutorial, setShowChattingTutorial] = useState(false)

  useEffect(() => {
    if (pathname !== '/chat') return

    const fetchChatSeen = async () => {
      if (!auth.userInfo.loveTypeCategory) {
        testRequiredModal()
        return
      }

      const seen = await bridge.getChatTutorialSeen()
      if (seen || chatStatus !== ChatRoomStateDataChatRoomStateEnum.BeforeInit) {
        setShowChattingTutorial(false)
        return
      }

      setShowChattingTutorial(true)
    }

    fetchChatSeen()
  }, [])

  const testRequiredModal = () => {
    alertDialog.open({
      title: (
        <>
          모모와 대화를 시작하려면
          <br /> 애착유형 검사가 필요해요!
        </>
      ),
      description: (
        <>
          검사를 완료하면, 모모가 애착유형을 바탕으로
          <br /> 상담을 도와 드려요.
        </>
      ),
      cancelText: '다음에 하기',
      confirmText: '검사하러 가기',
      onCancel: () => {
        alertDialog.close()
        router.history.back()
      },
      onConfirm: () => {
        alertDialog.close()
        router.navigate({ to: '/attachment-test' })
      },
    })
  }

  const exitChattingModal = () => {
    alertDialog.open({
      title: (
        <>
          아직 대화가 진행 중이에요!
          <br /> 지금 나가시겠어요?
        </>
      ),
      description: (
        <>
          나갔다가 들어와도 대화를 이어갈 수 있어요.
          <br /> 단, 1일 이상 대화가 없으면 자동으로 종료돼요.
        </>
      ),
      cancelText: '나가기',
      confirmText: '이어서 대화하기',
      onCancel: () => {
        queryClient.invalidateQueries({ queryKey: chatService.chatRoomStatusQuery().queryKey })
        alertDialog.close()
        router.history.back()
      },
    })
  }

  const chattingTutorialModal = () => {
    const highlightedText = 'body2-medium text-malmo-rasberry-400'

    return (
      <div className="fixed inset-0 z-50 text-white">
        <div className="fixed inset-0 bg-black/80" />

        <div className="relative flex h-full w-full flex-col items-center justify-center">
          <div className="absolute top-[calc(var(--safe-top)-12px)] right-2 flex h-[72px] w-[72px] items-center justify-center rounded-full border-2 border-malmo-rasberry-500 bg-white">
            <p className="body2-semibold text-malmo-rasberry-500">종료하기</p>
            <div className="absolute right-[72px] bottom-[-86px] h-[120px] w-[97px] border-t-2 border-l-2 border-dashed border-malmo-rasberry-400">
              <div className="absolute bottom-0 left-[-5px] h-2 w-2 rounded-full bg-malmo-rasberry-300" />
            </div>
          </div>

          <p className="absolute top-[calc(var(--safe-top)+160px)] text-center">
            1. 모모와 <span className={highlightedText}>대화를 종료</span>하고 싶다면
            <span className={highlightedText}> 버튼</span>을 눌러주세요!
            <br />
            종료하지 않고 나가면, <span className={highlightedText}>1일 후에 자동 종료</span>돼요.
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
              <div className="absolute top-[-25px] left-0 h-[24px] border-l-2 border-dashed border-l-malmo-rasberry-400">
                <div className="absolute bottom-0 left-[-5px] h-2 w-2 rounded-full bg-malmo-rasberry-300" />
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
    )
  }

  return {
    testRequiredModal,
    exitChattingModal,
    chattingTutorialModal,
    showChattingTutorial,
  }
}
