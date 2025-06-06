import type { Meta, StoryObj } from '@storybook/react'
import { Textarea } from '@ui/common/components/textarea'

const meta = {
  title: 'Input/Textarea',
  component: Textarea,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Textarea>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    placeholder: '내용을 입력해주세요',
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: '비활성화된 텍스트영역입니다',
  },
}

export const WithValue: Story = {
  args: {
    value: '텍스트영역에 입력된 값입니다.',
    readOnly: true,
  },
}

export const CustomHeight: Story = {
  args: {
    placeholder: '높이가 조정된 텍스트영역입니다',
    className: 'min-h-[200px]',
  },
}
