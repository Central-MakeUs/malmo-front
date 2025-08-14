import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { useEffect } from 'react'
import z from 'zod'

import { AttachmentTestIntro, AttachmentTestInfoSection, AttachmentTypesSection } from '@/features/attachment'
import { useAuth } from '@/features/auth'
import { useTheme } from '@/shared/contexts/theme.context'
import { Button } from '@/shared/ui'

const searchSchema = z.object({
  from: z.string().optional(),
})

export const Route = createFileRoute('/attachment-test/')({
  component: AttachmentTestPage,
  validateSearch: searchSchema,
})

function AttachmentTestPage() {
  const navigate = useNavigate()
  const { setStatusColor } = useTheme()
  const { from } = useSearch({ from: Route.id })
  const { userInfo } = useAuth()
  const nickname = userInfo.nickname || '사용자'

  useEffect(() => {
    setStatusColor('#FDEDF0')

    return () => {
      setStatusColor('#fff')
    }
  }, [])

  const handleStartTest = () => {
    navigate({ to: '/attachment-test/question' })
  }

  return (
    <div className="relative flex h-full w-full flex-col bg-malmo-rasberry-25">
      {/* 상단 라즈베리 배경 섹션 */}
      <AttachmentTestIntro nickname={nickname} from={from} />

      {/* 흰색 섹션 */}
      <div className="-mt-1 flex-1 rounded-t-[24px] bg-white">
        <div className="mt-[48px] px-[20px]">
          {/* 애착유형 검사 소개 섹션 */}
          <AttachmentTestInfoSection />

          {/* 애착유형 소개 섹션 */}
          <AttachmentTypesSection />

          {/* 플로팅 버튼을 위한 하단 여백 */}
          <div className="pb-[154px]"></div>
        </div>
      </div>

      {/* 플로팅 버튼 */}
      <div className="fixed right-0 bottom-[var(--safe-bottom)] left-0 z-10 flex justify-center px-5 py-4">
        <Button text="시작하기" onClick={handleStartTest} />
      </div>
    </div>
  )
}
