import { z } from 'zod'

export const pageSearchSchema = z.object({
  order: z.enum(['ASC', 'DESC']).optional().catch(undefined),
  page: z.number().int().min(1).catch(1),
  pageSize: z.number().int().min(10).max(50).catch(10),
  modalAction: z.enum(['create', 'update', 'show']).optional().catch(undefined),
})
