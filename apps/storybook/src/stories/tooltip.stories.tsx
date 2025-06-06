import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '@ui/common/components/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@ui/common/components/tooltip'

const meta = {
  title: 'Components/Tooltip',
  component: Tooltip,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    delayDuration: {
      control: { type: 'number', min: 0, step: 50 },
      description: '지연 시간을 밀리초 단위로 설정해 주세요.',
    },
  },
} satisfies Meta<typeof Tooltip>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    delayDuration: 0,
  },
  render: (args: any & { side?: 'top' | 'right' | 'bottom' | 'left' }) => (
    <Tooltip {...args}>
      <TooltipTrigger asChild>
        <Button>툴팁 보기</Button>
      </TooltipTrigger>

      <TooltipContent side={args.side ?? 'top'}>툴팁 내용입니다.</TooltipContent>
    </Tooltip>
  ),
  parameters: {
    docs: {
      description: {
        story: '기본 툴팁 예시입니다.',
      },
    },
  },
}

export const Sides: Story = {
  render: () => (
    <div className="flex gap-4">
      {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
        <Tooltip key={side} delayDuration={0}>
          <TooltipTrigger asChild>
            <Button>{side}</Button>
          </TooltipTrigger>
          <TooltipContent side={side}>방향: {side}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: { story: '방향별 툴팁 예시입니다.' },
    },
  },
}
