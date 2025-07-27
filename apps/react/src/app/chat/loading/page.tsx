import { createFileRoute, useNavigate } from '@tanstack/react-router'
import summary from '@/assets/images/characters/summary.png'
import { useEffect } from 'react'
import chatService from '@/shared/services/chat.service'
import { useQueryClient } from '@tanstack/react-query'
import { chatKeys } from '@/features/chat/hook/use-chat-queries'

export const Route = createFileRoute('/chat/loading/')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  useEffect(() => {
    async function completeChatRoom() {
      try {
        const { data } = await chatService.postChatroomComplete()

        queryClient.removeQueries({ queryKey: chatKeys.messages() })
        await queryClient.invalidateQueries({ queryKey: chatKeys.status() })

        navigate({ to: '/chat/result', search: { chatId: data?.chatRoomId, fromHistory: false } })
      } catch (error) {
        console.error('Error completing chat room:', error)
        navigate({ to: '/' })
      }
    }
    completeChatRoom()
  }, [navigate, queryClient])

  return (
    <div className="flex h-full flex-col items-center justify-center gap-[47px]">
      <img src={summary} alt="Summary Image" className="h-[160px] w-[179px]" />
      <div className="text-center">
        <h1 className="heading1-bold text-gray-iron-950">모모가 대화를 요약하고 있어요</h1>
        <p className="body2-medium text-gray-iron-500">조금만 기다려주세요!</p>
      </div>
    </div>
  )
}
