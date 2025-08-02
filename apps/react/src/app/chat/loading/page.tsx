import summaryAnimation from '@/assets/lottie/summary.json'

import { useEffect } from 'react'
import Lottie from 'lottie-react'
import chatService from '@/shared/services/chat.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/chat/loading/')({
  component: RouteComponent,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(chatService.chatRoomStatusQuery())
  },
})

function RouteComponent() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // 채팅 완료 mutation 사용
  const chatServiceOptions = chatService.completeChatRoomMutation()
  const completeChatMutation = useMutation({
    ...chatServiceOptions,
    onSuccess: async (data) => {
      // 2초 대기
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // 캐시 정리 및 업데이트
      queryClient.removeQueries({ queryKey: chatService.chatMessagesQuery().queryKey })
      await queryClient.invalidateQueries({ queryKey: chatService.chatRoomStatusQuery().queryKey })

      // 결과 페이지로 이동
      navigate({ to: '/chat/result', search: { chatId: data?.chatRoomId, fromHistory: false } })
    },
    onError: () => {
      // 서비스단 에러
      chatServiceOptions.onError?.()
      // 홈으로 이동
      navigate({ to: '/' })
    },
  })

  useEffect(() => {
    // 컴포넌트 마운트 시 채팅 완료 실행
    completeChatMutation.mutate()
  }, [])

  return (
    <div className="flex h-full flex-col items-center justify-center gap-[47px]">
      <Lottie animationData={summaryAnimation} className="px-[28px]" />
      <div className="text-center">
        <h1 className="heading1-bold text-gray-iron-950">모모가 대화를 요약하고 있어요</h1>
        <p className="body2-medium text-gray-iron-500">조금만 기다려주세요!</p>
      </div>
    </div>
  )
}
