import type { Meta, StoryObj } from '@storybook/react'
import { Select } from '@ui/common/components/select'
import { FormProvider, useForm } from 'react-hook-form'

// Storybook 메타 설정
const meta: Meta<typeof Select> = {
  title: 'Input/Select',
  component: Select,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    placeholder: {
      control: 'text',
      description: '선택되지 않았을 때 표시되는 텍스트입니다.',
    },
    disabled: {
      control: 'boolean',
      description: 'Select를 비활성화합니다.',
    },
    className: {
      control: 'text',
      description: '추가적인 CSS 클래스를 적용할 수 있습니다.',
    },
    options: {
      control: 'object',
      description: '선택 가능한 옵션 목록입니다.',
    },
  },
}

export default meta
type Story = StoryObj<typeof Select>

export const Default: Story = {
  render: () => {
    const methods = useForm()
    return (
      <FormProvider {...methods}>
        <Select
          placeholder="Select an option"
          options={[
            { value: 'option1', label: 'Option 1' },
            { value: 'option2', label: 'Option 2' },
            { value: 'option3', label: 'Option 3' },
          ]}
        />
      </FormProvider>
    )
  },
}

export const WithDefaultValue: Story = {
  render: () => {
    const methods = useForm({
      defaultValues: { select: 'option2' },
    })

    return (
      <FormProvider {...methods}>
        <Select
          defaultValue="option2"
          placeholder="Select an option"
          options={[
            { value: 'option1', label: 'Option 1' },
            { value: 'option2', label: 'Option 2' },
            { value: 'option3', label: 'Option 3' },
          ]}
        />
      </FormProvider>
    )
  },
}

export const Disabled: Story = {
  render: () => {
    const methods = useForm()
    return (
      <FormProvider {...methods}>
        <Select
          disabled
          placeholder="Disabled Select"
          options={[
            { value: 'option1', label: 'Option 1' },
            { value: 'option2', label: 'Option 2' },
            { value: 'option3', label: 'Option 3' },
          ]}
        />
      </FormProvider>
    )
  },
}

export const CustomStyled: Story = {
  render: () => {
    const methods = useForm()
    return (
      <FormProvider {...methods}>
        <Select
          className="border-red-500 text-red-500"
          placeholder="Custom Styled Select"
          options={[
            { value: 'option1', label: '🔥 Hot Option' },
            { value: 'option2', label: '❄️ Cool Option' },
            { value: 'option3', label: '⭐ Special Option' },
          ]}
        />
      </FormProvider>
    )
  },
}
