import type { Meta, StoryObj } from '@storybook/react'
import { Slider } from '@ui/common/components/slider'
import { useState } from 'react'

const meta: Meta<typeof Slider> = {
  title: 'Input/Slider',
  component: Slider,
  argTypes: {
    defaultValue: {
      control: { type: 'number' },
      description: '슬라이더의 초기 값',
      defaultValue: 50,
    },
    min: {
      control: { type: 'number' },
      description: '슬라이더의 최소값',
      defaultValue: 0,
    },
    max: {
      control: { type: 'number' },
      description: '슬라이더의 최대값',
      defaultValue: 100,
    },
    step: {
      control: { type: 'number' },
      description: '슬라이더 값이 증가/감소하는 단위',
      defaultValue: 1,
    },
    disabled: {
      control: { type: 'boolean' },
      description: '슬라이더 비활성화 여부',
      defaultValue: false,
    },
    onValueChange: {
      action: 'onValueChange',
      description: '슬라이더 값이 변경될 때 실행되는 콜백 함수',
    },
  },
}

export default meta
type Story = StoryObj<typeof Slider>

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState([50])

    return (
      <div className="w-64">
        <Slider {...args} defaultValue={value} onValueChange={setValue} />
        <p className="mt-2 text-sm">Value: {value[0]}</p>
      </div>
    )
  },
}

export const CustomRange: Story = {
  render: (args) => {
    const [value, setValue] = useState([100])

    return (
      <div className="w-64">
        <Slider {...args} min={0} max={200} step={5} defaultValue={value} onValueChange={setValue} />
        <p className="mt-2 text-sm">Value: {value[0]}</p>
      </div>
    )
  },
}

export const Disabled: Story = {
  render: (args) => (
    <div className="w-64">
      <Slider {...args} disabled defaultValue={[50]} />
      <p className="mt-2 text-sm">Disabled</p>
    </div>
  ),
}

export const RangeSlider: Story = {
  render: (args) => {
    const [value, setValue] = useState([25, 75])

    return (
      <div className="w-64">
        <Slider {...args} defaultValue={value} onValueChange={setValue} />
        <p className="mt-2 text-sm">Values: {value.join(' - ')}</p>
      </div>
    )
  },
}
