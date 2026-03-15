import { z } from 'zod'

export type PersonalityFlow = 'my-personality' | 'partner-personality' | 'chat-entry'

export const personalityFlowSearchSchema = z.object({
  flow: z.enum(['my-personality', 'partner-personality', 'chat-entry']).optional(),
  chatId: z.number().optional(),
})

export type PersonalityFlowSearch = z.infer<typeof personalityFlowSearchSchema>
