import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '@ui/common/components/button'
import { Toaster } from '@ui/common/components/sonner'
import { toast } from 'sonner'

const meta = {
  title: 'Components/Toaster',
  component: Toaster,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    position: {
      control: 'select',
      options: ['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'],
      description: '토스트가 화면에 표시될 위치를 선택해 주세요.',
    },
    duration: {
      control: { type: 'number', min: 1000, step: 500 },
      description: '토스트가 자동으로 사라지기까지의 시간을 밀리초 단위로 설정해 주세요.',
    },
    richColors: {
      control: 'boolean',
      description: '풍부한 색상 모드를 사용할지 선택해 주세요.',
    },
  },
} satisfies Meta<typeof Toaster>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    position: 'top-right',
    duration: 3000,
    richColors: false,
  },
  parameters: {
    docs: {
      description: {
        story: '기본 토스트 알림 예시입니다. 버튼을 클릭하여 토스트를 확인해 보세요.',
      },
    },
  },
  render: (args) => (
    <>
      <Button onClick={() => toast.success('작업이 완료되었습니다.')}>토스트 표시</Button>
      <Toaster {...args} />
    </>
  ),
}
