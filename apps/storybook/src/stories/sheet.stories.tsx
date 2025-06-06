import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '@ui/common/components/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@ui/common/components/sheet'
import { useState } from 'react'

const meta: Meta<typeof SheetContent> = {
  title: 'Modal/Sheet',
  component: SheetContent,
  argTypes: {
    side: {
      control: { type: 'select', options: ['top', 'bottom', 'left', 'right'] },
      description: '시트가 나타나는 방향을 설정합니다.',
      defaultValue: 'right',
    },
  },
}

export default meta
type Story = StoryObj<typeof SheetContent>

export const Default: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false)

    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline">Open Sheet</Button>
        </SheetTrigger>
        <SheetContent {...args} className="p-6">
          <SheetHeader>
            <SheetTitle>기본 시트</SheetTitle>
            <SheetDescription>이것은 기본 시트입니다.</SheetDescription>
          </SheetHeader>
          <SheetFooter>
            <SheetClose asChild>
              <Button variant="secondary">닫기</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    )
  },
}
