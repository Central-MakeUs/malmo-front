import type { Meta, StoryObj } from '@storybook/react'
import { RadioGroup, RadioGroupItem } from '@ui/common/components/radio-group'
import { FormProvider, useForm } from 'react-hook-form'

// Storybook 메타 설정
const meta: Meta<typeof RadioGroup> = {
  title: 'Input/RadioGroup',
  component: RadioGroup,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    defaultValue: {
      control: 'text',
      description: '초기 선택된 라디오 버튼의 값입니다.',
    },
    disabled: {
      control: 'boolean',
      description: '라디오 그룹을 비활성화합니다.',
    },
    className: {
      control: 'text',
      description: '추가적인 CSS 클래스를 적용할 수 있습니다.',
    },
  },
}

export default meta
type Story = StoryObj<typeof RadioGroup>

export const Default: Story = {
  render: () => {
    const methods = useForm()
    return (
      <FormProvider {...methods}>
        <RadioGroup defaultValue="option1">
          <RadioGroupItem value="option1">Option 1</RadioGroupItem>
          <RadioGroupItem value="option2">Option 2</RadioGroupItem>
          <RadioGroupItem value="option3">Option 3</RadioGroupItem>
        </RadioGroup>
      </FormProvider>
    )
  },
}

export const NoDefaultValue: Story = {
  render: () => {
    const methods = useForm()
    return (
      <FormProvider {...methods}>
        <RadioGroup>
          <RadioGroupItem value="option1">Option 1</RadioGroupItem>
          <RadioGroupItem value="option2">Option 2</RadioGroupItem>
          <RadioGroupItem value="option3">Option 3</RadioGroupItem>
        </RadioGroup>
      </FormProvider>
    )
  },
}

// ✅ 비활성화된 RadioGroup
export const Disabled: Story = {
  render: () => {
    const methods = useForm()
    return (
      <FormProvider {...methods}>
        <RadioGroup defaultValue="option1" disabled>
          <RadioGroupItem value="option1">Option 1</RadioGroupItem>
          <RadioGroupItem value="option2">Option 2</RadioGroupItem>
          <RadioGroupItem value="option3">Option 3</RadioGroupItem>
        </RadioGroup>
      </FormProvider>
    )
  },
}

export const CustomStyled: Story = {
  render: () => {
    const methods = useForm()
    return (
      <FormProvider {...methods}>
        <RadioGroup defaultValue="option2" className="flex flex-col space-y-2">
          <RadioGroupItem value="option1" className="text-primary">
            Option 1
          </RadioGroupItem>
          <RadioGroupItem value="option2" className="font-bold text-red-500">
            Option 2
          </RadioGroupItem>
          <RadioGroupItem value="option3" className="text-green-500">
            Option 3
          </RadioGroupItem>
        </RadioGroup>
      </FormProvider>
    )
  },
}
