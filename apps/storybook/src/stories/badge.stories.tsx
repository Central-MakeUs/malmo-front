import type { Meta, StoryObj } from '@storybook/react'
import { Badge } from '@ui/common/components/badge'

// Badge 스토리 메타
const meta = {
  title: 'Components/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'outline'],
      description: '뱃지 스타일을 설정합니다.',
    },
    asChild: {
      control: 'boolean',
      description: 'Slot 사용 여부를 설정합니다. true로 설정하면 Badge 컴포넌트가 자식 요소로 감싸집니다.',
    },
    className: {
      control: 'text',
      description: '추가 클래스 이름을 지정할 수 있습니다.',
    },
  },
} satisfies Meta<typeof Badge>

export default meta

type Story = StoryObj<typeof meta>

// 기본
export const Default: Story = {
  args: {
    children: 'Default',
    variant: 'default',
  },
}

// Secondary
export const Secondary: Story = {
  args: {
    children: 'Secondary',
    variant: 'secondary',
  },
}

// Destructive
export const Destructive: Story = {
  args: {
    children: 'Destructive',
    variant: 'destructive',
  },
}

// Outline
export const Outline: Story = {
  args: {
    children: 'Outline',
    variant: 'outline',
  },
}
