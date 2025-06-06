import type { Meta, StoryObj } from '@storybook/react'
import { DateRangePicker } from '@ui/common/components/date-range-picker'

const meta = {
  title: 'Input/DateRangePicker',
  component: DateRangePicker,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    locale: {
      control: 'select',
      options: ['ko', 'en'],
      description: '사용하실 로케일을 선택해 주세요.',
    },
    placeholder: {
      control: 'text',
      description: '자리표시자(플레이스홀더)를 입력해 주세요.',
    },
    disabled: {
      control: 'boolean',
      description: '컴포넌트를 비활성화할지 선택해 주세요.',
    },
    onChange: {
      action: 'changed',
      description: '날짜 범위가 변경될 때 호출됩니다.',
    },
  },
} satisfies Meta<typeof DateRangePicker>

export default meta

type Story = StoryObj<typeof meta>

// 기본 한국어
export const Default: Story = {
  args: {
    locale: 'ko',
    placeholder: '날짜를 선택하세요.',
    disabled: false,
  },
  parameters: {
    docs: { description: { story: '기본 한국어 DateRangePicker 예시입니다.' } },
  },
}

// 영어 로케일
export const EnglishLocale: Story = {
  args: {
    locale: 'en',
    placeholder: 'Select a date range',
    disabled: false,
  },
  parameters: {
    docs: { description: { story: '영어 로케일 예시입니다.' } },
  },
}

// 비활성화
export const Disabled: Story = {
  args: {
    locale: 'ko',
    placeholder: '비활성화됨',
    disabled: true,
  },
  parameters: {
    docs: { description: { story: '비활성화된 상태 예시입니다.' } },
  },
}
