import type { Meta, StoryObj } from '@storybook/react'
import { InputSearch } from '@ui/common/components/input-search'
import { useState } from 'react'

interface Item {
  id: number
  name: string
}

const sampleData: Item[] = Array.from({ length: 20 }, (_, i) => ({ id: i + 1, name: `옵션 ${i + 1}` }))

const meta = {
  title: 'Input/InputSearch',
  component: InputSearch,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    multiple: {
      control: 'boolean',
      description: '다중 선택 여부입니다.',
    },
    searchable: {
      control: 'boolean',
      description: '검색 기능을 사용하실지 선택해 주세요.',
    },
    placeholder: {
      control: 'text',
      description: '자리표시자를 입력해 주세요.',
    },
  },
} satisfies Meta<typeof InputSearch<Item>>

export default meta

type Story = StoryObj<typeof meta>

const Template = (args: any) => {
  const [value, setValue] = useState<any>(args.multiple ? [] : null)
  return (
    <InputSearch<Item>
      {...args}
      value={value}
      onChange={setValue}
      onSearch={async (text?: string) => {
        if (!text) return { data: sampleData }
        return { data: sampleData.filter((d) => d.name.includes(text)) }
      }}
      onValue={async (val) => sampleData.find((d) => d.id === val)}
    />
  )
}

export const SingleSelect: Story = {
  args: {
    multiple: false,
    searchable: true,
    placeholder: '옵션을 선택하세요...',
    data: sampleData,
  },
  render: Template,
  parameters: {
    docs: { description: { story: '단일 선택 예시입니다.' } },
  },
}

export const MultiSelect: Story = {
  args: {
    multiple: true,
    searchable: true,
    placeholder: '복수 선택 가능',
    data: sampleData,
  },
  render: Template,
  parameters: {
    docs: { description: { story: '다중 선택 예시입니다.' } },
  },
}
