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

      <Link to={'/chat/history'} className="w-[200px]">
        채팅 기록
      </Link>

      <Button
        onClick={async () => {
          const data = await bridge.logout()
        }}
      >
        로그아웃
      </Button>

      <Button
        onClick={async () => {
          const data = await memberService.findOne()
        }}
      >
        멤버
      </Button>
    </div>
  )
}
