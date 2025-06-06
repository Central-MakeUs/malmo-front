import type { Meta, StoryObj } from '@storybook/react'
import { BottomButton } from '@ui/common/components/bottom-button'

// 메타
const meta = {
  title: 'Components/BottomButton',
  component: BottomButton,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    buttonText: {
      control: 'text',
      description: '버튼에 표시할 텍스트를 설정합니다.',
    },
    disabled: {
      control: 'boolean',
      description: '버튼을 비활성화할지 여부를 설정합니다.',
    },
    loading: {
      control: 'boolean',
      description: '로딩 스피너를 표시할지 여부를 설정합니다.',
    },
    onClick: {
      action: 'clicked',
      description: '버튼이 클릭되면 호출됩니다.',
    },
  },
} satisfies Meta<typeof BottomButton>

export default meta

type Story = StoryObj<typeof meta>

// 기본
export const Default: Story = {
  args: {
    buttonText: '확인',
    disabled: false,
    loading: false,
  },
  parameters: {
    docs: {
      description: {
        story: '기본 상태의 BottomButton입니다.',
      },
    },
  },
}

// 비활성화
export const Disabled: Story = {
  args: {
    buttonText: '비활성화',
    disabled: true,
    loading: false,
  },
  parameters: {
    docs: {
      description: {
        story: '버튼이 비활성화된 예시입니다.',
      },
    },
  },
}

// 로딩
export const Loading: Story = {
  args: {
    buttonText: '로딩 중',
    disabled: false,
    loading: true,
  },
  parameters: {
    docs: {
      description: {
        story: '로딩 스피너가 표시된 예시입니다.',
      },
    },
  },
}
