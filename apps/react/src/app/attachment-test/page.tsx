import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Button } from '@/shared/ui'
import { useAuth } from '@/features/auth'
import { AttachmentTestIntro, AttachmentTestInfoSection, AttachmentTypesSection } from '@/features/attachment'
import { useEffect } from 'react'
import bridge from '@/shared/bridge'

export const Route = createFileRoute('/attachment-test/')({
  component: AttachmentTestPage,
})

function AttachmentTestPage() {
  const navigate = useNavigate()
  const { userInfo } = useAuth()
  const nickname = userInfo.nickname || '사용자'

  useEffect(() => {
    bridge.changeStatusBarColor('#FDEDF0')

    return () => {
      bridge.changeStatusBarColor('#fff')
    }
  }, [])

  const handleStartTest = () => {
    bridge.toggleOverlay(3)
    navigate({ to: '/attachment-test/question' })
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      {/* 상단 라즈베리 배경 섹션 */}
      <AttachmentTestIntro nickname={nickname} />

      {/* 흰색 섹션 */}
      <div className="flex-1 bg-white">
        <div className="mt-[48px] px-[20px]">
          {/* 애착유형 검사 소개 섹션 */}
          <AttachmentTestInfoSection />

          {/* 애착유형 소개 섹션 */}
          <AttachmentTypesSection />

          {/* 시작 버튼 */}
          <div className="mt-[80px] pb-[20px]">
            <Button text="시작하기" onClick={handleStartTest} />
          </div>
        </div>
      </div>
    </div>
  )
}
