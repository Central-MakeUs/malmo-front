import { useAuth } from '@/features/auth'
import memberService from '@/shared/services/member.service'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Button } from '@ui/common/components/button'
import { isAxiosError } from 'axios'

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
      <Button
        onClick={async () => {
          // const { data: test } = await testApi.test()
          // console.log('테스트 API 응답:', test)
          try {
            const { data: member } = await memberService.findOne()
            console.log('유저 정보:', member)
          } catch (error) {
            if (isAxiosError(error)) {
              if (error.response) {
                console.error('백엔드 API 응답 오류:', error.response.data)

                const backendErrorMessage = error.response.data?.message || '서버 응답 오류'

                return {
                  success: false,
                  message: `[${error.response.status}] ${backendErrorMessage}`,
                }
              }
            }
            console.error('API 호출 중 오류 발생:', error)
          }
        }}
      >
        유저 정보 가져오기
      </Button>
      HomePage
    </div>
  )
}
