import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '@ui/common/components/button'
import { Modal } from '@ui/common/components/modal'
import { useState } from 'react'

const meta: Meta<typeof Modal> = {
  title: 'Modal/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: '모달의 제목을 설정합니다.',
      defaultValue: '모달 제목',
    },
    description: {
      control: 'text',
      description: '모달의 설명을 설정합니다.',
      defaultValue: '이것은 기본 모달입니다.',
    },
    okText: {
      control: 'text',
      description: '확인 버튼의 텍스트를 설정합니다.',
      defaultValue: '확인',
    },
    cancelText: {
      control: 'text',
      description: '취소 버튼의 텍스트를 설정합니다.',
      defaultValue: '취소',
    },
    cancel: {
      control: 'boolean',
      description: '취소 버튼 표시 여부를 결정합니다.',
      defaultValue: true,
    },
    bottomText: {
      control: 'text',
      description: '모달 하단에 추가할 텍스트를 설정합니다.',
      defaultValue: '추가 액션',
    },
    handleBottom: {
      action: 'handleBottom',
      description: '하단 버튼 클릭 시 호출되는 함수입니다.',
    },
    onOk: {
      action: 'onOk',
      description: '확인 버튼 클릭 시 호출되는 함수입니다.',
    },
    onCancel: {
      action: 'onCancel',
      description: '취소 버튼 클릭 시 호출되는 함수입니다.',
    },
  },
}

export default meta
type Story = StoryObj<typeof Modal>

export const Default: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false)

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Modal</Button>
        <Modal {...args} open={open} onOpenChange={setOpen}>
          <Button variant="outline">Open Modal</Button>
        </Modal>
      </>
    )
  },
}

export const WithCancel: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false)

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Modal With Cancel</Button>
        <Modal {...args} open={open} onOpenChange={setOpen} cancel>
          <Button variant="outline">Open Modal</Button>
        </Modal>
      </>
    )
  },
}

export const WithBottomButton: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false)

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Modal With Bottom</Button>
        <Modal
          {...args}
          open={open}
          onOpenChange={setOpen}
          bottomText="하단 추가 버튼"
          handleBottom={() => alert('하단 버튼 클릭됨')}
        >
          <Button variant="outline">Open Modal</Button>
        </Modal>
      </>
    )
  },
}

export const AutoOpen: Story = {
  render: (args) => <Modal {...args} defaultOpen={true} />,
}
