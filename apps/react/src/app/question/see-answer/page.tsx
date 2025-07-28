import { DetailHeaderBar } from '@/shared/components/header-bar'
import { Badge } from '@/shared/ui'
import { createFileRoute } from '@tanstack/react-router'
import { Pen } from 'lucide-react'
import MyHeart from '@/assets/icons/my-heart.svg'
import OtherHeart from '@/assets/icons/other-heart.svg'

export const Route = createFileRoute('/question/see-answer/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex h-screen flex-col">
      <DetailHeaderBar title="답변 보기" className="border-b-[1px] border-gray-iron-100" />

      <div className="flex-1">
        <Badge variant="rasberry" className="mx-5 mt-6 mb-2">
          1번째 마음 질문
        </Badge>
        <p className="heading1-bold mb-3 pr-15 pl-6 break-keep">내가 가장 사랑받는다고 느끼는 순간은 언제였나요?</p>
        <p className="body4-medium mb-8 pl-6 text-gray-iron-500">2025년 07월 19일</p>

        <hr className="mx-5 mb-5 h-1 rounded-[1px] border-gray-iron-200" />

        <div className="mb-15 px-5">
          <div className="mb-3 flex justify-between">
            <div className="flex items-center gap-2">
              <MyHeart className="h-6 w-6" />
              <p className="body1-semibold">베리</p>
            </div>

            <div className="flex items-center gap-1 text-gray-iron-500">
              <Pen className="h-4 w-4" />
              <p className="body4-medium">수정하기</p>
            </div>
          </div>

          <div className="rounded-[10px] bg-gray-neutral-100 px-5 py-4">
            <p className="body20reading-regular text-gray-iron-900">
              이건 첫번째 레슨. 작성하면 이렇게 되겠죠 작성하면 이렇게 되겠죠 작성하면 이렇게 되겠죠 작성하면 이렇게
              되겠죠 작성하면 이렇게 되겠죠
            </p>
          </div>
        </div>

        <div className="px-5">
          <div className="mb-3 flex justify-between">
            <div className="flex items-center gap-2">
              <OtherHeart className="h-6 w-6" />
              <p className="body1-semibold">하니</p>
            </div>
          </div>

          <div className="rounded-[10px] bg-gray-neutral-100 px-5 py-4">
            <p className="body20reading-regular text-gray-iron-500">아직 답변을 작성하지 않았어요!</p>
          </div>
        </div>
      </div>
    </div>
  )
}
