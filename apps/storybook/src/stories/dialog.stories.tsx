import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '@ui/common/components/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@ui/common/components/dialog'

// Storybook 메타 설정
const meta: Meta<typeof Dialog> = {
  title: 'Modal/Dialog',
  component: Dialog,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    open: {
      control: 'boolean',
      description: '다이얼로그의 열림/닫힘 상태를 제어합니다.',
    },
  },
}

export default meta
type Story = StoryObj<typeof Dialog>

// 기본 다이얼로그 스토리
export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogDescription>This is a sample dialog description.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

// 긴 내용이 포함된 다이얼로그
export const LongContent: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Long Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Long Content Dialog</DialogTitle>
          <DialogDescription>
            This dialog contains a lot of text to see how it behaves with long content. Lorem ipsum dolor sit amet,
            consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi.
            Nulla quis sem at nibh elementum imperdiet.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

// 다이얼로그 크기 변경 테스트
export const LargeDialog: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Large Dialog</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Large Dialog</DialogTitle>
          <DialogDescription>This dialog is wider than the default size.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}
