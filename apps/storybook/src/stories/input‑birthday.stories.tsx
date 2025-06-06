import type { Meta, StoryObj } from '@storybook/react'
import { InputBirthday } from '@ui/common/components/input-birthday'

const meta = {
  title: 'Input/InputBirthday',
  component: InputBirthday,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'text',
      description: 'YYYY-MM-DD 형식의 값을 지정해 주세요.',
    },
    'data-error': {
      control: 'boolean',
      description: '에러 상태를 표시할지 선택해 주세요.',
    },
    onChange: {
      action: 'changed',
      description: '값이 변경될 때 호출됩니다.',
    },
  },
} satisfies Meta<typeof InputBirthday>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { value: '', 'data-error': false },
  parameters: {
    docs: { description: { story: '기본 InputBirthday 예시입니다.' } },
  },
}

export const Filled: Story = {
  args: { value: '1995-07-28', 'data-error': false },
  parameters: {
    docs: { description: { story: '날짜가 입력된 상태 예시입니다.' } },
  },
}

export const ErrorState: Story = {
  args: { value: '1995-07', 'data-error': true },
  parameters: {
    docs: { description: { story: '에러 상태 예시입니다.' } },
  },
}
