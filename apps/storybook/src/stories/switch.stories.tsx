import type { Meta, StoryObj } from '@storybook/react'
import { Switch } from '@ui/common/components/switch'

const meta = {
  title: 'Input/Switch',
  component: Switch,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '토글 상태를 시각적으로 표현하는 스위치 컴포넌트입니다. Radix UI Switch를 기반으로 합니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    checked: {
      description: '스위치의 체크 상태를 제어합니다.',
      control: 'boolean',
    },
    disabled: {
      description: '스위치의 비활성화 상태를 제어합니다.',
      control: 'boolean',
    },
    onCheckedChange: {
      description: '스위치 상태가 변경될 때 호출되는 콜백 함수입니다.',
      action: 'checked changed',
    },
  },
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof Switch>

export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: '기본적인 스위치 컴포넌트입니다.',
      },
    },
  },
}

export const Checked: Story = {
  args: {
    checked: true,
  },
  parameters: {
    docs: {
      description: {
        story: '체크된 상태의 스위치입니다.',
      },
    },
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story: '비활성화된 상태의 스위치입니다.',
      },
    },
  },
}

export const DisabledChecked: Story = {
  args: {
    disabled: true,
    checked: true,
  },
  parameters: {
    docs: {
      description: {
        story: '체크되고 비활성화된 상태의 스위치입니다.',
      },
    },
  },
}
