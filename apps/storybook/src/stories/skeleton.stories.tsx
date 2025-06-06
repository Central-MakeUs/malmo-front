import type { Meta, StoryObj } from '@storybook/react'
import { Card } from '@ui/common/components/card'
import { Skeleton } from '@ui/common/components/skeleton'
import { Button } from '@ui/common/components/button'

// Storybook 메타 설정
const meta: Meta<typeof Skeleton> = {
  title: 'Layout/Skeleton',
  component: Skeleton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: 'text',
      description: '추가적인 CSS 클래스를 적용할 수 있습니다.',
    },
  },
}

export default meta

export const Default = () => {
  return <Skeleton className="h-4 w-[200px]" />
}
Default.parameters = {
  docs: {
    description: {
      story: '기본 스켈레톤',
    },
  },
}

export const CircleSkeleton = () => {
  return <Skeleton className="size-12 rounded-full" />
}
CircleSkeleton.parameters = {
  docs: {
    description: {
      story: '원형 스켈레톤',
    },
  },
}

export const CardSkeleton = () => {
  return (
    <Card className="w-[300px]">
      <div className="space-y-4 p-4">
        <Skeleton className="size-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[160px]" />
        </div>
      </div>
    </Card>
  )
}
CardSkeleton.parameters = {
  docs: {
    description: {
      story: '카드 스켈레톤',
    },
  },
}

export const ProductCardSkeleton = () => {
  return (
    <Card className="w-[300px]">
      <div className="space-y-4 p-4">
        <Skeleton className="h-[200px] w-full rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[150px]" />
        </div>
        <Skeleton className="h-10 w-full rounded-md" />
      </div>
    </Card>
  )
}
ProductCardSkeleton.parameters = {
  docs: {
    description: {
      story: '상품 카드 스켈레톤',
    },
  },
}

export const CommentSkeleton = () => {
  return (
    <div className="w-[400px] space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex space-x-4">
          <Skeleton className="size-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      ))}
    </div>
  )
}
CommentSkeleton.parameters = {
  docs: {
    description: {
      story: '댓글 스켈레톤',
    },
  },
}

export const TableSkeleton = () => {
  return (
    <div className="w-[600px]">
      <div className="space-y-4">
        <div className="flex justify-between">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-[120px]" />
          ))}
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex justify-between">
            {Array.from({ length: 4 }).map((_, j) => (
              <Skeleton key={j} className="h-4 w-[120px]" />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
TableSkeleton.parameters = {
  docs: {
    description: {
      story: '테이블 스켈레톤',
    },
  },
}

export const ProfileSkeleton = () => {
  return (
    <div className="w-[300px] space-y-8">
      <div className="flex items-center space-x-4">
        <Skeleton className="size-16 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[150px]" />
          <Skeleton className="h-4 w-[100px]" />
        </div>
      </div>
      <div className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  )
}
ProfileSkeleton.parameters = {
  docs: {
    description: {
      story: '프로필 스켈레톤',
    },
  },
}

export const ListSkeleton = () => {
  return (
    <div className="w-[300px] space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
          <Skeleton className="size-8 rounded" />
          <Skeleton className="h-4 flex-1" />
        </div>
      ))}
    </div>
  )
}
ListSkeleton.parameters = {
  docs: {
    description: {
      story: '리스트 스켈레톤',
    },
  },
}

// 카드 + 버튼 스켈레톤
export const CardWithButtonSkeleton = () => (
  <Card className="w-[320px] space-y-4 p-6">
    <Skeleton className="mb-2 h-6 w-1/2" />
    <Skeleton className="mb-2 h-4 w-full" />
    <Skeleton className="mb-4 h-4 w-2/3" />
    <Button variant="default" disabled>
      버튼
    </Button>
  </Card>
)
CardWithButtonSkeleton.parameters = {
  docs: {
    description: {
      story: '카드와 버튼이 포함된 스켈레톤',
    },
  },
}

// 리스트 + 아바타 + 버튼 스켈레톤
export const ListWithAvatarAndButtonSkeleton = () => (
  <div className="w-[350px] space-y-4">
    {Array.from({ length: 2 }).map((_, i) => (
      <Card key={i} className="flex items-center space-x-4 p-4">
        <Skeleton className="size-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <Button variant="outline" size="sm" disabled>
          버튼
        </Button>
      </Card>
    ))}
  </div>
)
ListWithAvatarAndButtonSkeleton.parameters = {
  docs: {
    description: {
      story: '아바타, 텍스트, 버튼이 조합된 리스트 스켈레톤',
    },
  },
}

// 프로필 카드 + 액션 버튼 스켈레톤
export const ProfileCardWithActionsSkeleton = () => (
  <Card className="w-[340px] space-y-4 p-6">
    <div className="flex items-center space-x-4">
      <Skeleton className="size-14 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
    <div className="flex gap-2">
      <Button variant="default" size="sm" disabled>
        버튼1
      </Button>
      <Button variant="outline" size="sm" disabled>
        버튼2
      </Button>
    </div>
  </Card>
)
ProfileCardWithActionsSkeleton.parameters = {
  docs: {
    description: {
      story: '프로필 카드와 액션 버튼이 포함된 스켈레톤',
    },
  },
}
