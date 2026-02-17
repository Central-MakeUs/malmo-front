import { z } from 'zod'

export const requiredProfileFlowSearchSchema = z.object({
  requiredProfileFlow: z
    .union([z.boolean(), z.enum(['true', 'false'])])
    .transform((value) => value === true || value === 'true')
    .catch(false),
})

type RequiredProfileFlowFields = {
  relationshipStatus?: string
  personalityType?: string
  otherPersonalityType?: string
}

export type RequiredProfileFlowPath = '/relationship-status' | '/mbti' | '/partner-mbti'

export function getRequiredProfileFlowStartPath(userInfo: RequiredProfileFlowFields): RequiredProfileFlowPath | null {
  if (!userInfo.relationshipStatus) {
    return '/relationship-status'
  }

  if (!userInfo.personalityType) {
    return '/mbti'
  }

  if (!userInfo.otherPersonalityType) {
    return '/partner-mbti'
  }

  return null
}
