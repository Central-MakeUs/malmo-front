import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'

import momoIdle from '@/assets/images/momo-home-idle.png'
import { useAuth } from '@/features/auth'
import { wrapWithTracking } from '@/shared/analytics'
import { BUTTON_NAMES, CATEGORIES } from '@/shared/analytics/constants'
import chatService from '@/shared/services/chat.service'

export function ChatEntryCard() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { userInfo } = useAuth()
  const { mutateAsync: createChatRoom, isPending } = useMutation(chatService.createChatRoomMutation())

  const handleChatClick = wrapWithTracking(BUTTON_NAMES.START_NEW_CHAT, CATEGORIES.MAIN, async () => {
    if (isPending) return

    const hasUserPersonality = !!userInfo.personalityType && !!userInfo.loveTypeCategory
    const hasPartnerPersonality = !!userInfo.otherPersonalityType && !!userInfo.partnerLoveTypeCategory

    if (!hasUserPersonality || !hasPartnerPersonality) {
      navigate({ to: '/personality-flow-loading', search: { flow: 'chat-entry' } })
      return
    }

    const created = await createChatRoom()
    const createdId = created?.chatRoomId
    if (!createdId) {
      navigate({ to: '/chat' })
      return
    }

    queryClient.setQueryData(chatService.chatRoomStatusQuery().queryKey, {
      chatRoomId: createdId,
      createdAt: new Date().toISOString(),
    })

    navigate({ to: '/chat' })
  })

  return (
    <>
      {/* 연애고민상담 타이틀 */}
      <h1 className="heading2-semibold text-gray-iron-950">연애 고민 상담</h1>

      {/* 연애고민상담 박스 */}
      <div className="mt-3 mb-4 rounded-[10px] bg-malmo-rasberry-25 px-4 pt-4 pb-[18px]">
        <div className="flex h-full flex-col justify-between">
          {/* 상단 컨텐츠 */}
          <div className="flex items-start justify-between">
            {/* 뱃지 */}
            <div>
              <div className="inline-flex rounded-lg bg-malmo-rasberry-500 px-[9px] py-[1px]">
                <span className="label1-semibold text-white">START</span>
              </div>

              {/* 설명 */}
              <div className="mt-[5px] pl-[4px]">
                <p className="body2-semibold text-gray-iron-900">
                  모모와 연애 고민 상담을
                  <br />
                  시작해 보세요
                </p>
              </div>
            </div>

            {/* 모모 이미지 */}
            <img src={momoIdle} alt="모모" className="h-24 w-28" />
          </div>

          {/* 하단 버튼 */}
          <button className="h-[44px] w-full rounded-[32px] bg-white" onClick={handleChatClick} disabled={isPending}>
            <span className="body2-semibold text-malmo-rasberry-500">새 대화 시작하기</span>
          </button>
        </div>
      </div>
    </>
  )
}
