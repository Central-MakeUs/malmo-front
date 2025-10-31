import { QueryClient, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import Lottie from 'lottie-react'
import { useEffect } from 'react'

import summaryAnimation from '@/assets/lottie/summary.json'
import { Screen } from '@/shared/layout/screen'
import { useIsFrozenRoute } from '@/shared/navigation/transition/route-phase-context'
import chatService from '@/shared/services/chat.service'

const LOADING_DELAY_MS = 1500

type CompletionResult = Awaited<ReturnType<ReturnType<typeof chatService.completeChatRoomMutation>['mutationFn']>>
let completionPromise: Promise<CompletionResult> | null = null
let lastCompletionResult: CompletionResult | null = null

export const Route = createFileRoute('/chat/loading/')({
  component: RouteComponent,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(chatService.chatRoomStatusQuery())
  },
})

function RouteComponent() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const isFrozen = useIsFrozenRoute()

  useEffect(() => {
    if (isFrozen) return
    let isActive = true

    const completeChat = async () => {
      try {
        const result = await getCompletionPromise(queryClient)
        if (!isActive) return

        navigate({
          to: '/chat/result',
          search: { chatId: result?.chatRoomId, fromHistory: false },
          replace: true,
        })
      } catch {
        if (!isActive) return
        navigate({ to: '/', replace: true })
      }
    }

    void completeChat()

    return () => {
      isActive = false
    }
  }, [isFrozen, navigate, queryClient])

  return <LoadingScreen />
}

function LoadingScreen() {
  return (
    <Screen>
      <Screen.Content className="flex h-full w-full -translate-y-[60px] flex-col items-center justify-center gap-6">
        <Lottie animationData={summaryAnimation} className="px-7" />
        <div className="text-center">
          <h1 className="heading1-bold text-gray-iron-950">모모가 대화를 요약하고 있어요</h1>
          <p className="body2-medium text-gray-iron-500">조금만 기다려주세요!</p>
        </div>
      </Screen.Content>
    </Screen>
  )
}

function getCompletionPromise(queryClient: QueryClient) {
  if (completionPromise) {
    return completionPromise
  }

  const statusQuery = chatService.chatRoomStatusQuery()
  const currentStatus = queryClient.getQueryData(statusQuery.queryKey)

  if (lastCompletionResult && currentStatus !== 'ALIVE') {
    return Promise.resolve(lastCompletionResult)
  }

  if (currentStatus === 'ALIVE') {
    lastCompletionResult = null
  }

  const chatServiceOptions = chatService.completeChatRoomMutation()
  completionPromise = (async () => {
    try {
      const result = await chatServiceOptions.mutationFn()
      lastCompletionResult = result ?? null

      queryClient.removeQueries({ queryKey: chatService.chatMessagesQuery().queryKey })
      await queryClient.invalidateQueries({ queryKey: chatService.chatRoomStatusQuery().queryKey })

      await delay(LOADING_DELAY_MS)
      return result
    } catch (error) {
      chatServiceOptions.onError?.(error)
      throw error
    } finally {
      completionPromise = null
    }
  })()

  return completionPromise
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
