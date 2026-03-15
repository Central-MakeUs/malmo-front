import { z } from 'zod'

export type PersonalityFlow = 'my-personality' | 'partner-personality' | 'chat-entry'

export const personalityFlowSearchSchema = z.object({
  flow: z.enum(['my-personality', 'partner-personality', 'chat-entry']).optional(),
  chatId: z.number().optional(),
})

export type PersonalityFlowSearch = z.infer<typeof personalityFlowSearchSchema>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type NavigateFn = (opts: any) => void

/** 내 MBTI 저장 후 다음 단계로 이동. flow 없으면 false 반환 (fallback 처리 필요) */
export function navigateAfterMyMbti(
  navigate: NavigateFn,
  flow: PersonalityFlow | undefined,
  chatId: number | undefined
): boolean {
  if (flow === 'my-personality') {
    navigate({ to: '/my-attachment-select', search: { flow } })
    return true
  }
  if (flow === 'chat-entry') {
    navigate({ to: '/my-attachment-select', search: { flow, chatId } })
    return true
  }
  return false
}

/** 상대 MBTI 저장 후 다음 단계로 이동. flow 없으면 false 반환 */
export function navigateAfterPartnerMbti(
  navigate: NavigateFn,
  flow: PersonalityFlow | undefined,
  chatId: number | undefined
): boolean {
  if (flow === 'partner-personality') {
    navigate({ to: '/partner-attachment-select', search: { flow } })
    return true
  }
  if (flow === 'chat-entry') {
    navigate({ to: '/partner-attachment-select', search: { flow, chatId } })
    return true
  }
  return false
}

/** 내 애착유형 선택 후 다음 단계로 이동 */
export function navigateAfterMyAttachment(
  navigate: NavigateFn,
  flow: PersonalityFlow | undefined,
  chatId: number | undefined
) {
  if (flow === 'my-personality') {
    navigate({ to: '/attachment-test/result/my', search: { from: 'my-page' } })
    return
  }
  if (flow === 'chat-entry') {
    navigate({ to: '/my-result-preview', search: { flow, chatId } })
    return
  }
  navigate({ to: '/attachment-test/result/my' })
}

/** 내 결과 미리보기에서 다음 단계로 이동 */
export function navigateAfterMyResultPreview(
  navigate: NavigateFn,
  flow: PersonalityFlow | undefined,
  chatId: number | undefined
) {
  if (flow === 'chat-entry') {
    navigate({ to: '/partner-mbti', search: { flow, chatId } })
    return
  }
  navigate({ to: '/', replace: true })
}

/** 상대 애착유형 선택 후 다음 단계로 이동 */
export function navigateAfterPartnerAttachment(
  navigate: NavigateFn,
  flow: PersonalityFlow | undefined,
  chatId: number | undefined,
  hasData: boolean
) {
  if (flow === 'chat-entry') {
    if (hasData) {
      navigate({ to: '/partner-result-preview', search: { flow, chatId } })
    } else {
      navigate({ to: '/chat', search: { chatId }, replace: true })
    }
    return
  }
  navigate({ to: '/attachment-test/result/partner' })
}
