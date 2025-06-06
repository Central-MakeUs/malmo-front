import type { Meta, StoryObj } from '@storybook/react'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@ui/common/components/command'
import { ArrowRight, Book, Settings, User } from 'lucide-react'
import { useState } from 'react'

const meta = {
  title: 'Layout/Command',
  component: CommandDialog,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    open: { control: 'boolean', description: '열림 여부를 설정합니다.' },
    title: { control: 'text', description: '제목을 설정합니다.' },
    description: { control: 'text', description: '설명을 설정합니다.' },
  },
} satisfies Meta<typeof CommandDialog>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    open: true,
    title: '명령 팔레트',
    description: '실행할 명령을 검색하세요.',
  },
  parameters: {
    docs: {
      description: {
        story: '기본 명령 팔레트 예시입니다.',
      },
    },
  },
  render: (args) => {
    const [open, setOpen] = useState(args.open)
    return (
      <>
        <button className="rounded border px-3 py-1 text-sm" onClick={() => setOpen((o) => !o)}>
          팔레트 열기
        </button>
        <CommandDialog {...args} open={open} onOpenChange={setOpen}>
          <CommandInput placeholder="검색..." />
          <CommandList>
            <CommandEmpty>결과가 없습니다.</CommandEmpty>
            <CommandGroup heading="일반">
              <CommandItem>
                <User className="size-4" /> 프로필
                <CommandShortcut>⌘P</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <Settings className="size-4" /> 설정
                <CommandShortcut>⌘S</CommandShortcut>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="도움말">
              <CommandItem>
                <Book className="size-4" /> 문서
                <CommandShortcut>⌘D</CommandShortcut>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="기타">
              <CommandItem disabled>
                <ArrowRight className="size-4" /> 차후 추가될 기능
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </>
    )
  },
}
