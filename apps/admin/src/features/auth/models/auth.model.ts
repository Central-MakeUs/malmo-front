import * as Regex from '@data/utils/regex'
import { z } from 'zod'

export const LoginFormSchema = z.object({
  name: z.string({ required_error: 'ID를 입력해주세요.' }).trim().min(1, { message: 'ID를 입력해주세요.' }),
  password: z
    .string({ required_error: '비밀번호를 입력해주세요.' })
    .trim()
    .regex(Regex.password, { message: '올바른 비밀번호 형식이 아닙니다.' }),
  remember: z.boolean().optional(),
})

export type LoginFormType = z.infer<typeof LoginFormSchema>
