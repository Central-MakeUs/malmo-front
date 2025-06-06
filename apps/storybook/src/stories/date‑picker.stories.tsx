import type { Meta, StoryObj } from '@storybook/react'
import { DatePicker } from '@ui/common/components/date-picker'

const meta = {
  title: 'Input/DatePicker',
  component: DatePicker,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    locale: {
      control: 'select',
      options: ['ko', 'en'],
      description: '사용할 로케일을 선택해 주세요.',
    },
    placeholder: { control: 'text', description: '자리표시자를 입력해 주세요.' },
    disabled: { control: 'boolean', description: '컴포넌트를 비활성화할지 선택해 주세요.' },
    value: { control: 'text', description: 'ISO 날짜 문자열을 지정할 수 있습니다.' },
    onChange: { action: 'changed', description: '날짜가 변경될 때 호출됩니다.' },
  },
} satisfies Meta<typeof DatePicker>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { locale: 'ko', placeholder: '날짜를 선택하세요', disabled: false },
  parameters: {
    docs: { description: { story: '기본 한국어 DatePicker 예시입니다.' } },
  },
}

export const EnglishLocale: Story = {
  args: { locale: 'en', placeholder: 'Select a date', disabled: false },
  parameters: {
    docs: { description: { story: '영어 로케일 예시입니다.' } },
  },
}

export const Disabled: Story = {
  args: { locale: 'ko', placeholder: '비활성화됨', disabled: true },
  parameters: {
    docs: { description: { story: '비활성화된 상태 예시입니다.' } },
  },
}
