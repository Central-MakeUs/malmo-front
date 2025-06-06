import type { Meta, StoryObj } from '@storybook/react'
import { AspectRatio } from '@ui/common/components/aspect-ratio'

// 메타
const meta = {
  title: 'Components/AspectRatio',
  component: AspectRatio,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    ratio: {
      control: 'number',
      description: '비율을 설정합니다. 예: 1.777은 16:9입니다.',
    },
    className: {
      control: 'text',
      description: '추가 클래스를 적용합니다.',
    },
  },
} satisfies Meta<typeof AspectRatio>

export default meta

type Story = StoryObj<typeof meta>

// 기본 16:9
export const Default: Story = {
  args: { ratio: 16 / 9 },
  parameters: {
    docs: {
      description: {
        story: '기본 16:9 비율로 콘텐츠를 보여드립니다.',
      },
    },
  },
  render: (args) => (
    <AspectRatio {...args}>
      <img src="https://picsum.photos/800/450" alt="example" className="h-full w-full object-cover" />
    </AspectRatio>
  ),
}

// 1:1 정사각형
export const Square: Story = {
  args: { ratio: 1 },
  parameters: {
    docs: {
      description: {
        story: '1:1 비율(정사각형) 예시입니다.',
      },
    },
  },
  render: (args) => (
    <AspectRatio {...args}>
      <img src="https://picsum.photos/600" alt="square" className="h-full w-full object-cover" />
    </AspectRatio>
  ),
}
