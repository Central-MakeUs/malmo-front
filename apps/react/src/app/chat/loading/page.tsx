import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import Lottie from 'lottie-react'
import { useEffect } from 'react'

import summaryAnimation from '@/assets/lottie/summary.json'
import chatService from '@/shared/services/chat.service'

export const Route = createFileRoute('/chat/loading/')({
  component: RouteComponent,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(chatService.chatRoomStatusQuery())
  },
})

function RouteComponent() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const chatServiceOptions = chatService.completeChatRoomMutation()
  const completeChatMutation = useMutation({
    ...chatServiceOptions,
    onSuccess: async (data) => {
      await new Promise((r) => setTimeout(r, 1500))
      queryClient.removeQueries({ queryKey: chatService.chatMessagesQuery().queryKey })
      await queryClient.invalidateQueries({ queryKey: chatService.chatRoomStatusQuery().queryKey })
      navigate({ to: '/chat/result', search: { chatId: data?.chatRoomId, fromHistory: false } })
    },
    onError: () => {
      chatServiceOptions.onError?.()
      navigate({ to: '/' })
    },
  })

  useEffect(() => {
    completeChatMutation.mutate()
  }, [])

  return (
    <div
      className="app-safe fixed inset-0 z-0"
      style={{
        paddingBottom: 'var(--safe-bottom)',
        paddingTop: 'var(--safe-top)',
        paddingLeft: 'var(--safe-left)',
        paddingRight: 'var(--safe-right)',
      }}
    >
      <div className="flex h-full w-full items-center justify-center overflow-hidden overscroll-none">
        <div className="flex flex-col items-center justify-center gap-[47px]">
          <Lottie animationData={summaryAnimation} className="max-h-[40vh] max-w-[520px] px-[28px]" />
          <div className="text-center">
            <h1 className="heading1-bold text-gray-iron-950">모모가 대화를 요약하고 있어요</h1>
            <p className="body2-medium text-gray-iron-500">조금만 기다려주세요!</p>
          </div>
        </div>
      </div>
    </div>
  )
}
