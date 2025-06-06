import type { Meta, StoryObj } from '@storybook/react'
import { ToggleGroup } from '@ui/common/components/toggle-group'
import { useState } from 'react'

const meta = {
  title: 'Input/ToggleGroup',
  component: ToggleGroup,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['single', 'multiple'],
      description: '선택 방식을 지정해 주세요.',
    },
    variant: {
      control: 'select',
      options: ['default', 'outline'],
      description: '버튼 스타일을 지정해 주세요.',
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg'],
      description: '버튼 크기를 지정해 주세요.',
    },
  },
} satisfies Meta<typeof ToggleGroup>

export default meta

type Story = StoryObj<typeof meta>

const options = [
  { value: 'one', label: 'One' },
  { value: 'two', label: 'Two' },
  { value: 'three', label: 'Three' },
]

const Template = (args: any) => {
  const [value, setValue] = useState(args.type === 'multiple' ? [] : '')
  return <ToggleGroup {...args} value={value} onChange={setValue} options={options} />
}

export const SingleSelect: Story = {
  args: {
    type: 'single',
    variant: 'default',
    size: 'default',
  },
  render: Template,
  parameters: {
    docs: { description: { story: '단일 선택 예시입니다.' } },
  },
}

export const MultipleSelect: Story = {
  args: {
    type: 'multiple',
    variant: 'outline',
    size: 'default',
  },
  render: Template,
  parameters: {
    docs: { description: { story: '다중 선택 예시입니다.' } },
  },
}
