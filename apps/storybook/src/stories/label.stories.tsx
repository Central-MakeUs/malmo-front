import { Label } from '@ui/common/components/label'
import type { Meta, StoryObj } from '@storybook/react'

// Storybook 메타 설정
const meta: Meta<typeof Label> = {
  title: 'Components/Label',
  component: Label,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: 'text',
      description: '레이블에 표시할 텍스트입니다.',
    },
    className: {
      control: 'text',
      description: '추가적인 CSS 클래스를 적용할 수 있습니다.',
    },
  },
}

export default meta
type Story = StoryObj<typeof Label>

// 기본 Label 스토리
export const Default: Story = {
  args: {
    children: 'Default Label',
  },
}

// 비활성화된 Label
export const Disabled: Story = {
  args: {
    children: 'Disabled Label',
    className: 'peer-disabled',
  },
}

// 커스텀 스타일이 적용된 Label
export const CustomStyled: Story = {
  args: {
    children: 'Custom Styled Label',
    className: 'text-primary font-bold',
  },
}
