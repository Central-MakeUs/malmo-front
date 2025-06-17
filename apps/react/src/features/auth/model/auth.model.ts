import { z } from 'zod'

const password = /^[\da-zA-Z!@#$%^&*()?+-_~=/]{6,40}$/

export const LoginFormSchema = z.object({
  accountId: z.string().trim().min(1, { message: '계정 ID는 필수입니다' }),
  password: z.string().trim().regex(password, { message: '올바른 비밀번호 형식이 아닙니다.' }),
})

export type LoginFormType = z.infer<typeof LoginFormSchema>
