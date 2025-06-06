import type { Meta, StoryObj } from '@storybook/react'
import { InputAddress } from '@ui/common/components/input-address'

const meta = {
  title: 'Input/InputAddress',
  component: InputAddress,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    value: { control: 'text', description: '우편번호 값을 지정해 주세요.' },
    onChange: { action: 'change', description: '우편번호가 변경되면 호출됩니다.' },
    onChangeSido: { action: 'changeSido', description: '시·도가 변경되면 호출됩니다.' },
    onChangeAddress: { action: 'changeAddress', description: '주소가 변경되면 호출됩니다.' },
    disabled: { control: 'boolean', description: '비활성화할지 선택해 주세요.' },
  },
} satisfies Meta<typeof InputAddress>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    value: '',
    disabled: false,
  },
  parameters: {
    docs: { description: { story: '기본 InputAddress 예시입니다.' } },
  },
}

export const Filled: Story = {
  args: {
    value: '06247',
    disabled: false,
  },
  parameters: {
    docs: { description: { story: '값이 입력된 상태 예시입니다.' } },
  },
}

export const Disabled: Story = {
  args: {
    value: '',
    disabled: true,
  },
  parameters: {
    docs: { description: { story: '비활성화된 상태 예시입니다.' } },
  },
}
