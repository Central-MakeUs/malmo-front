import { createFileRoute, redirect } from '@tanstack/react-router'
import { usePartnerInfo } from '@/features/member'
import { AttachmentResultContent } from '@/features/attachment/ui/result/attachment-result-content'

export const Route = createFileRoute('/attachment-test/result/partner/')({
  beforeLoad: async ({ context }) => {
    // 인증되지 않은 경우 로그인 페이지로 리다이렉트
    if (!context.auth?.authenticated) {
      throw redirect({
        to: '/login',
      })
    }
  },
  component: PartnerAttachmentResultPage,
})

function PartnerAttachmentResultPage() {
  const { data: partnerInfo } = usePartnerInfo()

  return <AttachmentResultContent userInfo={partnerInfo} type="partner" />
}
