import { createFileRoute, useNavigate } from '@tanstack/react-router'
import note from '@/assets/images/note.png'
import { useEffect } from 'react'
import chatService from '@/shared/services/chat.service'

export const Route = createFileRoute('/chat/loading/')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  useEffect(() => {
    async function completeChatRoom() {
      try {
        const { data } = await chatService.postChatroomComplete()
        navigate({ to: '/chat/result', search: { chatId: data?.chatRoomId } })
      } catch (error) {
        console.error('Error completing chat room:', error)
        navigate({ to: '/' })
      }
    }
    completeChatRoom()
  }, [])

  return (
    <div className="flex h-full flex-col items-center justify-center gap-[47px]">
      <img src={note} alt="Note and Pen Image" className="h-[135px] w-[192.33px]" />
      <div className="text-center">
        <h1 className="heading1-bold text-gray-iron-950">모모가 대화를 요약하고 있어요</h1>
        <p className="body2-medium text-gray-iron-500">조금만 기다려주세요!</p>
      </div>
    </div>
  )
}
