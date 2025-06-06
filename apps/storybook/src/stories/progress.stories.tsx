import type { Meta, StoryObj } from '@storybook/react'
import { useEffect, useState } from 'react'
import { Progress } from '@ui/common/components/progress'

const meta: Meta<typeof Progress> = {
  title: 'Components/Progress',
  component: Progress,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '진행 상태를 표시하는 프로그레스 바 컴포넌트입니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'number', min: 0, max: 100, step: 1 },
      description: '진행 상태 값 (0 ~ 100)',
      defaultValue: 50,
    },
    className: {
      control: 'text',
      description: '프로그레스 바의 스타일을 커스터마이징할 수 있습니다.',
    },
    indicatorClassName: {
      control: 'text',
      description: '프로그레스 바 인디케이터의 스타일을 커스터마이징할 수 있습니다.',
    },
  },
}

export default meta
type Story = StoryObj<typeof Progress>

export const Default: Story = {
  render: (args) => {
    const [progress, setProgress] = useState(0)

    useEffect(() => {
      const interval = setInterval(
        () => {
          setProgress((prev) => {
            if (prev >= 100) return 0

            const randomIncrement = Math.floor(Math.random() * 8) + 1

            if (prev >= 95) {
              return Math.min(prev + 1, 100)
            }

            return Math.min(prev + randomIncrement, 100)
          })
        },
        Math.random() * 300 + 200
      )

      return () => clearInterval(interval)
    }, [])

    return (
      <div className="w-[300px] space-y-2">
        <Progress {...args} value={progress} />
        <p className="text-center text-sm text-gray-500">{progress}% 완료</p>
      </div>
    )
  },
}
Default.parameters = {
  docs: {
    description: {
      story: '기본적인 프로그레스 바입니다. 기본값은 50%입니다.',
    },
  },
}

export const CustomStyles: Story = {
  render: (args) => (
    <div className="w-[300px] space-y-4">
      <Progress {...args} value={60} className="h-3 bg-slate-200" indicatorClassName="bg-green-500" />
      <Progress {...args} value={40} className="h-3 bg-slate-200" indicatorClassName="bg-yellow-500" />
      <Progress {...args} value={80} className="h-3 bg-slate-200" indicatorClassName="bg-red-500" />
    </div>
  ),
}
CustomStyles.parameters = {
  docs: {
    description: {
      story: '프로그레스 바의 높이와 색상을 커스터마이징할 수 있습니다.',
    },
  },
}

export const AnimatedProgress: Story = {
  render: (args) => {
    const [progress, setProgress] = useState(0)

    useEffect(() => {
      const interval = setInterval(() => {
        setProgress((prev) => (prev < 100 ? prev + 5 : 0))
      }, 500)

      return () => clearInterval(interval)
    }, [])

    return (
      <div className="w-[300px] space-y-2">
        <Progress {...args} value={progress} />
        <p className="text-center text-sm text-gray-500">{progress}% 완료</p>
      </div>
    )
  },
}
AnimatedProgress.parameters = {
  docs: {
    description: {
      story:
        '애니메이션이 적용된 프로그레스 바입니다. 0%에서 100%까지 자동으로 증가하며, 100%에 도달하면 다시 0%로 돌아갑니다.',
    },
  },
}

export const LoadingStates: Story = {
  render: () => (
    <div className="w-[300px] space-y-4">
      <div className="space-y-1">
        <p className="text-sm font-medium">다운로드 중...</p>
        <Progress value={35} />
        <p className="text-xs text-gray-500">35% - 2분 남음</p>
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium">업로드 중...</p>
        <Progress value={75} indicatorClassName="bg-blue-500" />
        <p className="text-xs text-gray-500">75% - 1분 남음</p>
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium">완료!</p>
        <Progress value={100} indicatorClassName="bg-green-500" />
        <p className="text-xs text-gray-500">100% - 완료됨</p>
      </div>
    </div>
  ),
}
LoadingStates.parameters = {
  docs: {
    description: {
      story: '다양한 로딩 상태를 표현하는 프로그레스 바입니다.',
    },
  },
}
