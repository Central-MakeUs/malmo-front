import type { Meta, StoryObj } from '@storybook/react'
import { Toggle } from '@ui/common/components/toggle'
import { Bold } from 'lucide-react'
import { useState } from 'react'

const meta = {
  title: 'Input/Toggle',
  component: Toggle,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outline'],
      description: '버튼 스타일을 선택해 주세요.',
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg'],
      description: '버튼 크기를 선택해 주세요.',
    },
    disabled: {
      control: 'boolean',
      description: '버튼을 비활성화할지 여부를 설정해 주세요.',
    },
  },
} satisfies Meta<typeof Toggle>

export default meta

type Story = StoryObj<typeof meta>

const Template = (args: any) => {
  const [pressed, setPressed] = useState(false)
  return (
    <Toggle {...args} pressed={pressed} onPressedChange={setPressed}>
      <Bold />
    </Toggle>
  )
}

export const Default: Story = {
  args: {
    variant: 'default',
    size: 'default',
    disabled: false,
  },
  render: Template,
  parameters: {
    docs: { description: { story: '기본 Toggle 버튼 예시입니다.' } },
  },
}

export const Outline: Story = {
  args: {
    variant: 'outline',
    size: 'default',
  },
  render: Template,
  parameters: {
    docs: { description: { story: '외곽선 스타일 Toggle 예시입니다.' } },
  },
}

export const Sizes: Story = {
  render: () => (
    <div className="flex gap-2">
      <Toggle size="sm">
        <Bold />
      </Toggle>
      <Toggle size="default">
        <Bold />
      </Toggle>
      <Toggle size="lg">
        <Bold />
      </Toggle>
    </div>
  ),
  parameters: {
    docs: { description: { story: '크기별 Toggle 비교 예시입니다.' } },
  },
}
