import type { Meta, StoryObj } from '@storybook/react'
import { InputPhone } from '@ui/common/components/input-phone'
import { useState } from 'react'

const meta = {
  title: 'Input/InputPhone',
  component: InputPhone,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    placeholder: {
      control: 'text',
      description: '자리표시자를 입력해 주세요.',
    },
    sentPasscode: {
      control: 'boolean',
      description: '인증번호가 전송되었는지 여부입니다.',
    },
    verified: {
      control: 'boolean',
      description: '인증이 완료되었는지 여부입니다.',
    },
  },
} satisfies Meta<typeof InputPhone>

export default meta

type Story = StoryObj<typeof meta>

const Template = (args: any) => {
  const [value, setValue] = useState('')
  const [sent, setSent] = useState(false)
  const [verified, setVerified] = useState(false)

  return (
    <InputPhone
      {...args}
      value={value}
      sentPasscode={sent}
      verified={verified}
      onChange={setValue}
      onClickVerify={() => {
        if (!sent) {
          setSent(true)
        } else {
          setVerified(true)
        }
      }}
    />
  )
}

export const Default: Story = {
  args: {
    placeholder: '휴대폰 번호 입력',
    onClickVerify: () => {},
  },
  render: Template,
  parameters: {
    docs: { description: { story: '기본 휴대폰 번호 입력 예시입니다.' } },
  },
}

export const SentPasscode: Story = {
  args: {
    placeholder: '인증번호 전송됨',
    sentPasscode: true,
    onClickVerify: () => {},
  },
  render: Template,
  parameters: {
    docs: { description: { story: '인증번호가 전송된 상태 예시입니다.' } },
  },
}

export const Verified: Story = {
  args: {
    placeholder: '인증 완료',
    sentPasscode: true,
    verified: true,
    onClickVerify: () => {},
  },
  render: Template,
  parameters: {
    docs: { description: { story: '인증이 완료된 상태 예시입니다.' } },
  },
}
