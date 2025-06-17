import { LoginForm } from '@/features/auth/components'
import { LoginFormSchema, type LoginFormType } from '@/features/auth/model'
import { useAuth } from '@/shared/libs/auth'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { z } from 'zod'

const FALLBACK = '/' as const

export const Route = createFileRoute('/(auth)/auth/')({
  validateSearch: z.object({
    redirect: z.string().optional().catch(''),
  }),
  component: AuthPage,
})

function AuthPage() {
  const router = useRouter()
  const auth = useAuth()
  const navigate = Route.useNavigate()
  const search = Route.useSearch()

  async function handleSubmit(values: LoginFormType) {
    await auth.login(values)
    await router.invalidate()
    await navigate({ to: search.redirect || FALLBACK, replace: true })
  }

  return (
    <LoginForm<LoginFormType> schema={LoginFormSchema} onSubmit={handleSubmit} className="mx-6 my-auto h-full py-8" />
  )
}
