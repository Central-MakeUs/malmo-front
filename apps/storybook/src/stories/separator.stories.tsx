import { Separator } from '@ui/common/components/separator'
import type { Meta, StoryObj } from '@storybook/react'

// Storybook 메타 설정
const meta: Meta<typeof Separator> = {
  title: 'Components/Separator',
  component: Separator,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '컨텐츠를 시각적으로 구분하는 구분선 컴포넌트입니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'radio',
      options: ['horizontal', 'vertical'],
      description: '구분선의 방향을 설정합니다.',
    },
    className: {
      control: 'text',
      description: '추가적인 CSS 클래스를 적용할 수 있습니다.',
    },
    decorative: {
      control: 'boolean',
      description: '장식용 여부를 설정합니다.',
    },
  },
}

export default meta
type Story = StoryObj<typeof Separator>

// 기본 가로 구분선
// 기본 가로 구분선
export const Default: Story = {
  render: () => (
    <div className="w-[400px] p-4">
      <div className="text-sm text-gray-500">섹션 1</div>
      <Separator />
      <div className="text-sm text-gray-500">섹션 2</div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '기본적인 가로 구분선입니다.',
      },
    },
  },
}

// 세로 구분선
export const Vertical: Story = {
  render: () => (
    <div className="flex h-8 items-center space-x-4">
      <div className="text-sm text-gray-500">섹션 1</div>
      <Separator orientation="vertical" className="h-8 w-[2px]" />
      <div className="text-sm text-gray-500">섹션 2</div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '세로 방향의 구분선입니다.',
      },
    },
  },
}

// 두꺼운 구분선
export const Thick: Story = {
  render: () => (
    <div className="w-[400px] p-4">
      <div className="text-sm text-gray-500">섹션 1</div>
      <Separator className="border-8 bg-gray-200" />
      <div className="text-sm text-gray-500">섹션 2</div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '더 두껍게 스타일링된 구분선입니다.',
      },
    },
  },
}

// 컬러 구분선
export const Colored: Story = {
  render: () => (
    <div className="w-[400px] p-4">
      <div className="text-sm text-gray-500">섹션 1</div>
      <Separator className="bg-red-500" />
      <div className="text-sm text-gray-500">섹션 2</div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '커스텀 색상이 적용된 구분선입니다.',
      },
    },
  },
}

// 구분선 활용 예시
export const WithContent = () => {
  return (
    <div className="w-[400px] space-y-4">
      <div className="text-sm text-gray-500">섹션 1</div>
      <Separator />
      <div className="text-sm text-gray-500">섹션 2</div>
      <Separator decorative={false} />
      <div className="text-sm text-gray-500">섹션 3</div>
    </div>
  )
}
WithContent.parameters = {
  docs: {
    description: {
      story: '컨텐츠 사이에 구분선을 활용한 예시입니다.',
    },
  },
}

// 세로 구분선 활용 예시
export const VerticalWithContent = () => {
  return (
    <div className="flex h-8 items-center space-x-4">
      <div className="text-sm text-gray-500">메뉴 1</div>
      <Separator orientation="vertical" />
      <div className="text-sm text-gray-500">메뉴 2</div>
      <Separator orientation="vertical" />
      <div className="text-sm text-gray-500">메뉴 3</div>
    </div>
  )
}
VerticalWithContent.parameters = {
  docs: {
    description: {
      story: '메뉴 아이템 사이에 세로 구분선을 활용한 예시입니다.',
    },
  },
}
