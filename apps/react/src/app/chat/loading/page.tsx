import { createFileRoute, useNavigate } from '@tanstack/react-router'
import Lottie from 'lottie-react'
import { useEffect } from 'react'
import { z } from 'zod'

import summaryAnimation from '@/assets/lottie/summary.json'
import { Screen } from '@/shared/layout/screen'
import { useIsFrozenRoute } from '@/shared/navigation/transition/route-phase-context'

const LOADING_DELAY_MS = 5000

const searchSchema = z.object({
  chatId: z.number().optional(),
})

export const Route = createFileRoute('/chat/loading/')({
  component: RouteComponent,
  validateSearch: searchSchema,
})

function RouteComponent() {
  const navigate = useNavigate()
  const { chatId } = Route.useSearch()
  const isFrozen = useIsFrozenRoute()

  useEffect(() => {
    if (isFrozen) return
    const timerId = window.setTimeout(() => {
      if (chatId) {
        navigate({
          to: '/chat/result',
          search: { chatId, fromHistory: false },
          replace: true,
        })
        return
      }
      navigate({ to: '/', replace: true })
    }, LOADING_DELAY_MS)

    return () => {
      window.clearTimeout(timerId)
    }
  }, [chatId, isFrozen, navigate])

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
