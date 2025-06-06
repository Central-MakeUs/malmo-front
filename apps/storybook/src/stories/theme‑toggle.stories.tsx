import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '@ui/common/components/button'
import { ThemeToggle } from '@ui/common/components/theme-toggle'
import { useState } from 'react'

const meta = {
  title: 'Layout/ThemeToggle',
  component: ThemeToggle,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean', description: '버튼을 비활성화할지 여부를 설정해 주세요.' },
  },
} satisfies Meta<typeof ThemeToggle>

export default meta

type Story = StoryObj<typeof meta>

const Template = (args: any) => {
  const [dark, setDark] = useState(false)

  return (
    <div className={dark ? 'dark' : ''} style={{ padding: 20 }}>
      <div className="mb-4">
        <Button onClick={() => setDark((d) => !d)}>배경 토글 (스토리북용 가상)</Button>
      </div>
      <ThemeToggle {...args} />
    </div>
  )
}

export const Default: Story = {
  args: { disabled: false },
  render: Template,
  parameters: {
    docs: {
      description: {
        story: '테마 변경 버튼 예시입니다. (스토리북 데모용 가상 테마 토글 포함)',
      },
    },
  },
}
