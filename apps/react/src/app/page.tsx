import { useAuth } from '@/features/auth'
import bridge from '@/shared/bridge'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Button } from '@ui/common/components/button'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  const auth = useAuth()
  const navigate = useNavigate()

  return (
    <div>
      <Button
        onClick={async () => {
          const data = await auth.logout()
          if (data.success) {
            console.log('로그아웃 성공:', data.message)
            navigate({ to: '/login', replace: true })
          }
        }}
      >
        임시 로그아웃
      </Button>
      HomePage
    </div>
  )
}
