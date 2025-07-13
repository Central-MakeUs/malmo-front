import bridge from '@/shared/bridge'
import memberService from '@/shared/services/member.service'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '@ui/common/components/button'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <div>
      <Link to={'/chat'} className="w-[200px]">
        채팅화면
      </Link>

      <Button
        onClick={async () => {
          const data = await bridge.logout()
          console.log('로그아웃 데이터:', data)
        }}
      >
        로그아웃
      </Button>

      <Button
        onClick={async () => {
          const data = await memberService.findOne()
          console.log('멤버 데이터:', data)
        }}
      >
        멤버
      </Button>
    </div>
  )
}
