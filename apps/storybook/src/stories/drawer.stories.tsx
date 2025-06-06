import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '@ui/common/components/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@ui/common/components/drawer'
import { useState } from 'react'

const meta: Meta<typeof Drawer> = {
  title: 'Modal/Drawer',
  component: Drawer,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    shouldScaleBackground: {
      control: { type: 'boolean' },
      description: '배경이 스케일링될지 여부를 설정합니다.',
      defaultValue: true,
    },
  },
}

export default meta
type Story = StoryObj<typeof Drawer>

export const Default: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false)

    return (
      <Drawer {...args} open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button variant="outline">Open Drawer</Button>
        </DrawerTrigger>
        <DrawerContent className="p-4">
          <DrawerHeader>
            <DrawerTitle>Drawer Title</DrawerTitle>
            <DrawerDescription>이것은 기본 Drawer입니다.</DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="secondary">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    )
  },
}

export const WithLongContent: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false)

    return (
      <Drawer {...args} open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button variant="outline">Open Drawer with Long Content</Button>
        </DrawerTrigger>
        <DrawerContent className="h-[80vh] overflow-y-auto p-4">
          <DrawerHeader>
            <DrawerTitle>Drawer with Long Content</DrawerTitle>
            <DrawerDescription>스크롤 가능한 내용을 포함한 Drawer입니다.</DrawerDescription>
          </DrawerHeader>
          <div className="h-[500px] bg-gray-200 p-4">여기에 긴 내용을 추가할 수 있습니다.</div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="secondary">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    )
  },
}

export const WithoutCloseButton: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false)

    return (
      <Drawer {...args} open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button variant="outline">Open Drawer Without Close</Button>
        </DrawerTrigger>
        <DrawerContent className="p-4">
          <DrawerHeader>
            <DrawerTitle>Drawer Without Close Button</DrawerTitle>
            <DrawerDescription>닫기 버튼이 없는 Drawer입니다.</DrawerDescription>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>
    )
  },
}
