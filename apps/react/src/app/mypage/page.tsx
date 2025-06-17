import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/mypage/')({
  component: MyPage,
})

function MyPage() {
  return <div>마이페이지</div>
}
