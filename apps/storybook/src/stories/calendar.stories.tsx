import type { Meta, StoryObj } from '@storybook/react'
import { Calendar } from '@ui/common/components/calendar'
import { addDays } from 'date-fns'

const meta: Meta<typeof Calendar> = {
  title: 'Components/Calendar',
  component: Calendar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Calendar>

// 기본 캘린더
export const Default: Story = {
  args: {
    mode: 'single',
    selected: new Date(),
  },
}

// 날짜 범위 선택 캘린더
export const DateRangePicker: Story = {
  args: {
    mode: 'range',
    selected: {
      from: new Date(),
      to: addDays(new Date(), 7),
    },
  },
}

// 다중 선택 캘린더
export const MultipleSelection: Story = {
  args: {
    mode: 'multiple',
    selected: [new Date(), addDays(new Date(), 3), addDays(new Date(), 7)],
  },
}

// 비활성화된 날짜가 있는 캘린더
export const WithDisabledDates: Story = {
  args: {
    mode: 'single',
    selected: new Date(),
    disabled: [{ from: addDays(new Date(), 1), to: addDays(new Date(), 4) }],
  },
}

// 외부 날짜를 숨긴 캘린더
export const HiddenOutsideDays: Story = {
  args: {
    mode: 'single',
    selected: new Date(),
    showOutsideDays: false,
  },
}
