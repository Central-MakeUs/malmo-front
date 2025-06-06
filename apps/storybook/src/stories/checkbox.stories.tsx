import type { Meta, StoryObj } from '@storybook/react'
import { Checkbox } from '@ui/common/components/checkbox'

// Storybook 메타 설정
const meta: Meta<typeof Checkbox> = {
  title: 'Input/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
      description: '체크박스를 비활성화합니다.',
    },
    defaultChecked: {
      control: 'boolean',
      description: '기본적으로 체크된 상태로 시작합니다.',
    },
    onChange: {
      action: 'changed',
      description: '체크박스 상태 변경 시 호출되는 이벤트 핸들러입니다.',
    },
  },
}

export default meta
type Story = StoryObj<typeof Checkbox>

// 기본 체크박스 스토리
export const Default: Story = {
  args: {},
}

// 체크된 상태 스토리
export const Checked: Story = {
  args: {
    defaultChecked: true,
  },
}

// 비활성화된 상태 스토리
export const Disabled: Story = {
  args: {
    disabled: true,
  },
}

// 체크된 & 비활성화된 상태 스토리
export const CheckedDisabled: Story = {
  args: {
    defaultChecked: true,
    disabled: true,
  },
}
