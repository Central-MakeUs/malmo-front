import { createFileRoute, redirect } from '@tanstack/react-router'
import { z } from 'zod'

import { AttachmentResultContent } from '@/features/attachment/ui/result/attachment-result-content'
import { useAuth } from '@/features/auth'

const searchSchema = z.object({
  from: z.string().optional(),
})

export const Route = createFileRoute('/attachment-test/result/partner/')({
  validateSearch: searchSchema,
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
  const { userInfo } = useAuth()
  const { from } = Route.useSearch()
  const fromProp = from === 'partner-result-preview' ? 'partner-result-preview' : undefined

  const partnerData = {
    loveTypeCategory: userInfo.partnerLoveTypeCategory,
    personalityType: userInfo.otherPersonalityType,
  }

  return <AttachmentResultContent userInfo={partnerData} type="partner" from={fromProp} />
}
