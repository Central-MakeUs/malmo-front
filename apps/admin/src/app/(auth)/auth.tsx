import { LoginFormSchema, LoginFormType } from '@/features/auth/models'
import { useAuth } from '@/shared/libs/auth'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { LoginForm } from '@ui/admin/components/login-form'
import { useAlertDialog } from '@ui/common/hooks/alert-dialog.hook'
import { GalleryVerticalEnd } from 'lucide-react'
import { z } from 'zod'

const FALLBACK = '/' as const

export const Route = createFileRoute('/(auth)/auth')({
  validateSearch: z.object({
    redirect: z.string().optional().catch(''),
  }),
  component: AuthPage,
})

function AuthPage() {
  const router = useRouter()
  const alertDialog = useAlertDialog()
  const auth = useAuth()
  const navigate = Route.useNavigate()
  const search = Route.useSearch()

  async function handleSubmit(values: LoginFormType) {
    try {
      await auth.login(values)
      await router.invalidate()
      await navigate({ to: search.redirect || FALLBACK, replace: true })
    } catch (e: any) {
      if (e.status === 404) {
        alertDialog.open({
          title: '로그인 실패',
          description: 'ID 또는 비밀번호가 틀립니다. 다시 시도해주세요.',
        })
      } else {
        alertDialog.open({
          title: '로그인 실패',
          description: e.message,
        })
      }
    }
  }

  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <div className="flex items-center gap-2 self-center font-medium">
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <GalleryVerticalEnd className="size-4" />
        </div>
        <div className="select-none">{import.meta.env.VITE_PROVIDER_TITLE}</div>
      </div>
      <LoginForm<LoginFormType> schema={LoginFormSchema} onSubmit={handleSubmit} />
    </div>
  )
}
