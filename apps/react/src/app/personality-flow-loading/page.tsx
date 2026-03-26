import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import Lottie from 'lottie-react'
import { useEffect } from 'react'

import noteAnimation from '@/assets/lottie/note.json'
import { personalityFlowSearchSchema } from '@/features/profile/lib/personality-flow'
import { Screen } from '@/shared/layout/screen'

export const Route = createFileRoute('/personality-flow-loading/')({
  validateSearch: personalityFlowSearchSchema,
  component: PersonalityFlowLoadingPage,
})

function PersonalityFlowLoadingPage() {
  const navigate = useNavigate()
  const { flow } = useSearch({ from: Route.id })

  useEffect(() => {
    const timer = setTimeout(() => {
      if (flow === 'full-flow') {
        navigate({ to: '/mbti', search: { flow }, replace: true })
      } else if (flow === 'partner-personality') {
        navigate({ to: '/partner-mbti', search: { flow }, replace: true })
      } else {
        navigate({ to: '/mbti', search: { flow: 'my-personality' }, replace: true })
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <Screen>
      <Screen.Content className="bg-white">
        <div className="flex h-full w-full -translate-y-[60px] flex-col items-center justify-center px-5">
          <Lottie animationData={noteAnimation} className="h-[236px] w-[320px]" />
          <div className="mt-6 text-center">
            <h1 className="heading1-bold text-gray-iron-950">성향 프로필 생성중...</h1>
            <p className="body2-medium mt-2 text-gray-iron-500">
              {flow === 'my-personality'
                ? '나의 프로필을 완성하면'
                : flow === 'partner-personality'
                  ? '상대의 프로필을 완성하면'
                  : '나와 상대의 프로필을 완성하면'}
              <br />
              연애 상담을 진행할 수 있어요!
            </p>
          </div>
        </div>
      </Screen.Content>
    </Screen>
  )
}
