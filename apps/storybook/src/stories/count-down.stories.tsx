import type { Meta, StoryObj } from '@storybook/react'
import CountDown from '@ui/common/components/count-down'

const meta = {
  title: 'Components/CountDown',
  component: CountDown,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '시간 카운트다운을 표시하는 컴포넌트입니다. 주로 인증번호 만료 시간 등을 표시할 때 사용됩니다.',
      },
    },
  },
  tags: ['autodocs'],
  args: {
    date: new Date(Date.now() + 5 * 60 * 1000), // 5분 후
  },
  argTypes: {
    date: {
      control: 'date',
      description: '카운트다운의 목표 시간',
    },
    className: {
      control: 'text',
      description: '추가적인 스타일링을 위한 클래스명',
    },
  },
} satisfies Meta<typeof CountDown>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: '기본 카운트다운 컴포넌트',
      },
    },
  },
}

export const OneMinuteLeft: Story = {
  args: {
    date: new Date(Date.now() + 60 * 1000), // 1분 후
  },
  parameters: {
    docs: {
      description: {
        story: '1분 후 만료되는 카운트다운 컴포넌트',
      },
    },
  },
}

export const ThirtySecondsLeft: Story = {
  args: {
    date: new Date(Date.now() + 30 * 1000), // 30초 후
  },
  parameters: {
    docs: {
      description: {
        story: '30초 후 만료되는 카운트다운 컴포넌트',
      },
    },
  },
}

export const Expired: Story = {
  args: {
    date: new Date(Date.now() - 1000), // 1초 전 (만료된 상태)
  },
  parameters: {
    docs: {
      description: {
        story: '만료된 상태의 카운트다운 컴포넌트',
      },
    },
  },
}

export const CustomStyle: Story = {
  args: {
    date: new Date(Date.now() + 3 * 60 * 1000), // 3분 후
    className: 'text-2xl font-bold bg-gray-100 p-2 rounded',
  },
  parameters: {
    docs: {
      description: {
        story: '커스텀 스타일이 적용된 카운트다운 컴포넌트',
      },
    },
  },
}

export const MultipleTimers: Story = {
  render: () => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <span className="text-gray-500">인증번호 만료까지:</span>
          <CountDown date={new Date(Date.now() + 5 * 60 * 1000)} />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-500">잠시 후 만료:</span>
          <CountDown date={new Date(Date.now() + 30 * 1000)} />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-500">이미 만료됨:</span>
          <CountDown date={new Date(Date.now() - 1000)} />
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: '여러 카운트다운 컴포넌트를 동시에 사용할 수 있습니다.',
      },
    },
  },
}

export const WithLabel: Story = {
  render: () => {
    return (
      <div className="flex flex-col gap-4">
        <div className="rounded-lg border p-4">
          <p className="mb-2 text-gray-700">인증번호를 입력해주세요</p>
          <div className="flex items-center gap-2">
            <input type="text" className="w-32 rounded border px-3 py-2" placeholder="000000" maxLength={6} />
            <CountDown date={new Date(Date.now() + 3 * 60 * 1000)} />
          </div>
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: '라벨과 함께 사용할 수 있습니다.',
      },
    },
  },
}

export const DifferentSizes: Story = {
  render: () => {
    const futureDate = new Date(Date.now() + 4 * 60 * 1000)
    return (
      <div className="flex flex-col gap-4">
        <CountDown date={futureDate} className="text-xs" />
        <CountDown date={futureDate} className="text-sm" />
        <CountDown date={futureDate} className="text-base" />
        <CountDown date={futureDate} className="text-lg" />
        <CountDown date={futureDate} className="text-xl" />
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: '다양한 크기로 사용할 수 있습니다.',
      },
    },
  },
}

export const WithContainers: Story = {
  render: () => {
    return (
      <div className="space-y-4">
        <div className="rounded-lg bg-gray-100 p-4">
          <CountDown date={new Date(Date.now() + 2 * 60 * 1000)} />
        </div>
        <div className="rounded-lg bg-blue-50 p-4">
          <CountDown date={new Date(Date.now() + 4 * 60 * 1000)} />
        </div>
        <div className="rounded-lg bg-red-50 p-4">
          <CountDown date={new Date(Date.now() - 1000)} />
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: '컨테이너와 함께 사용할 수 있습니다.',
      },
    },
  },
}
