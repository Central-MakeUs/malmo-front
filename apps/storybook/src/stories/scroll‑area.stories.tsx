import type { Meta, StoryObj } from '@storybook/react'
import { ScrollArea } from '@ui/common/components/scroll-area'

const meta = {
  title: 'Components/ScrollArea',
  component: ScrollArea,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    className: { control: 'text', description: '추가 클래스를 입력해 주세요.' },
  },
} satisfies Meta<typeof ScrollArea>

export default meta

type Story = StoryObj<typeof meta>

const items = Array.from({ length: 30 }, (_, i) => `항목 ${i + 1}`)

export const Default: Story = {
  parameters: {
    docs: { description: { story: '기본 스크롤 영역 예시입니다.' } },
  },
  render: (args) => (
    <div className="h-48 w-64 border">
      <ScrollArea {...args} className="h-full w-full p-2">
        <ul className="space-y-1">
          {items.map((item) => (
            <li key={item} className="rounded bg-muted px-2 py-1 text-sm">
              {item}
            </li>
          ))}
        </ul>
      </ScrollArea>
    </div>
  ),
}
