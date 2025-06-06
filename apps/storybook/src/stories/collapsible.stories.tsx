import type { Meta, StoryObj } from '@storybook/react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@ui/common/components/collapsible'
import { ChevronDown } from 'lucide-react'

const meta = {
  title: 'Components/Collapsible',
  component: Collapsible,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    defaultOpen: {
      control: 'boolean',
      description: '초기에 열려 있을지 여부를 설정합니다.',
    },
    disabled: {
      control: 'boolean',
      description: '컴포넌트를 비활성화할지 여부를 설정합니다.',
    },
  },
} satisfies Meta<typeof Collapsible>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { defaultOpen: false },
  parameters: {
    docs: {
      description: { story: '기본 Collapsible 예시입니다.' },
    },
  },
  render: (args) => (
    <Collapsible {...args} className="w-[260px] rounded-md border p-4">
      <CollapsibleTrigger className="flex w-full items-center justify-between font-medium">
        <span>설정</span>
        <ChevronDown className="size-4 transition-transform data-[state=open]:rotate-180" />
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-3 space-y-2 text-sm">
        <p>여기에 내용을 넣어주세요.</p>
        <p>두 번째 줄 예시입니다.</p>
      </CollapsibleContent>
    </Collapsible>
  ),
}

export const OpenByDefault: Story = {
  args: { defaultOpen: true },
  parameters: {
    docs: {
      description: { story: '처음부터 열려 있는 상태를 보여드립니다.' },
    },
  },
  render: (args) => (
    <Collapsible {...args} className="w-[260px] rounded-md border p-4">
      <CollapsibleTrigger className="flex w-full items-center justify-between font-medium">
        <span>정보</span>
        <ChevronDown className="size-4 transition-transform data-[state=open]:rotate-180" />
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-3 space-y-2 text-sm">
        <p>열려 있는 기본 예시입니다.</p>
      </CollapsibleContent>
    </Collapsible>
  ),
}
