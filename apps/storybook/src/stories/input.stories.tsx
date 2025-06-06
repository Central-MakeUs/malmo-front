import type { Meta, StoryObj } from '@storybook/react'
import { Input } from '@ui/common/components/input'

const meta = {
  title: 'Input/Input',
  component: Input,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'file'],
      description: '입력 타입을 선택해 주세요.',
    },
    placeholder: {
      control: 'text',
      description: '자리표시자를 입력해 주세요.',
    },
    disabled: {
      control: 'boolean',
      description: '비활성화 여부입니다.',
    },
    value: {
      control: 'text',
      description: '초기 값을 지정할 수 있습니다.',
    },
  },
} satisfies Meta<typeof Input>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    type: 'text',
    placeholder: '텍스트 입력',
    disabled: false,
  },
  parameters: {
    docs: { description: { story: '기본 입력 필드 예시입니다.' } },
  },
}

export const Disabled: Story = {
  args: {
    type: 'text',
    placeholder: '비활성화됨',
    disabled: true,
  },
  parameters: {
    docs: { description: { story: '비활성화 상태 예시입니다.' } },
  },
}

export const Password: Story = {
  args: {
    type: 'password',
    placeholder: '비밀번호',
  },
  parameters: {
    docs: { description: { story: '비밀번호 입력 예시입니다.' } },
  },
}

export const File: Story = {
  args: {
    type: 'file',
  },
  parameters: {
    docs: { description: { story: '파일 선택 예시입니다.' } },
  },
}
