import type { Meta, StoryObj } from '@storybook/react'
import { InputPasscode } from '@ui/common/components/input-passcode'
import { addMinutes } from 'date-fns'
import { useState } from 'react'

const meta = {
  title: 'Input/InputPasscode',
  component: InputPasscode,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    placeholder: { control: 'text', description: '자리표시자를 입력해 주세요.' },
    verified: { control: 'boolean', description: '인증 완료 여부를 설정해 주세요.' },
    passCodeExpireAt: { control: 'date', description: '만료 시간을 지정해 주세요.' },
  },
} satisfies Meta<typeof InputPasscode>

export default meta

type Story = StoryObj<typeof meta>

const Template = (args: any) => {
  const [value, setValue] = useState('')
  const [verified, setVerified] = useState(false)

  return (
    <InputPasscode
      {...args}
      value={value}
      verified={verified}
      onChange={setValue}
      onConfirm={() => setVerified(true)}
    />
  )
}

export const Default: Story = {
  args: {
    placeholder: '인증번호 6자리',
    verified: false,
    passCodeExpireAt: addMinutes(new Date(), 3),
  },
  render: Template,
  parameters: {
    docs: { description: { story: '기본 인증번호 입력 예시입니다.' } },
  },
}

export const Verified: Story = {
  args: {
    placeholder: '인증 완료',
    verified: true,
    passCodeExpireAt: null,
  },
  render: (args) => {
    const [value, setValue] = useState('123456')
    return <InputPasscode {...args} value={value} onChange={setValue} onConfirm={() => {}} />
  },
  parameters: {
    docs: { description: { story: '인증이 완료된 상태 예시입니다.' } },
  },
}
