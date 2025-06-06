import type { Meta, StoryObj } from '@storybook/react'
import { InputPhoneInternational } from '@ui/common/components/input-phone-international'
import { useState } from 'react'

const meta = {
  title: 'Input/InputPhoneInternational',
  component: InputPhoneInternational,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    locale: {
      control: 'text',
      description: '로케일을 입력해 주세요. (예: "KO", "EN")',
    },
    defaultCountryCode: {
      control: 'text',
      description: '기본 국가 코드(ISO 2글자)입니다.',
    },
  },
} satisfies Meta<typeof InputPhoneInternational>

export default meta

type Story = StoryObj<typeof meta>

const Template = (args: any) => {
  const [value, setValue] = useState<string | undefined>(undefined)
  return <InputPhoneInternational {...args} value={value} onChange={setValue} />
}

export const Korea: Story = {
  args: {
    locale: 'KO',
    defaultCountryCode: 'KR',
  },
  render: Template,
  parameters: {
    docs: { description: { story: '한국(KR) 기본 예시입니다.' } },
  },
}

export const USA: Story = {
  args: {
    locale: 'EN',
    defaultCountryCode: 'US',
  },
  render: Template,
  parameters: {
    docs: { description: { story: '미국(US) 기본 예시입니다.' } },
  },
}
