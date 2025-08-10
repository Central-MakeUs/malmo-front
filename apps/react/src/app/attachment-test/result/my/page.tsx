import { createFileRoute, redirect } from '@tanstack/react-router'

import { AttachmentResultContent } from '@/features/attachment/ui/result/attachment-result-content'
import { useAuth } from '@/features/auth'

export const Route = createFileRoute('/attachment-test/result/my/')({
  beforeLoad: async ({ context }) => {
    // 인증되지 않은 경우 로그인 페이지로 리다이렉트
    if (!context.auth?.authenticated) {
      throw redirect({
        to: '/login',
      })
    }
  },
  component: MyAttachmentResultPage,
})

function MyAttachmentResultPage() {
  const { userInfo } = useAuth()

  return <AttachmentResultContent userInfo={userInfo} type="my" />
}
