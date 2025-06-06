import type { Meta, StoryObj } from '@storybook/react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogDestructive,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@ui/common/components/alert-dialog'

const meta = {
  title: 'Modal/AlertDialog',
  component: AlertDialog,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    defaultOpen: {
      control: 'boolean',
      description: '스토리 시작 시 다이얼로그가 열려 있을지 여부를 설정합니다.',
    },
  },
} satisfies Meta<typeof AlertDialog>

export default meta

type Story = StoryObj<typeof meta>

/**
 * ### 기본 AlertDialog
 * 간단한 확인/취소 다이얼로그 예시입니다.
 */
export const Default: Story = {
  args: {
    defaultOpen: false,
  },
  parameters: {
    docs: {
      description: {
        story: '기본 AlertDialog – 확인이 필요한 작업 전 사용자에게 경고/안내를 표시합니다.',
      },
    },
  },
  render: (args) => (
    <AlertDialog {...args}>
      <AlertDialogTrigger className="w-fit">
        <span>Open Dialog</span>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your account and remove your data from our
            servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
}

/**
 * ### 파괴적(Destructive) AlertDialog
 * 돌이킬 수 없는 작업을 강조하기 위해 파괴적 버튼 스타일을 사용합니다.
 */
export const Destructive: Story = {
  args: {
    defaultOpen: false,
  },
  parameters: {
    docs: {
      description: {
        story: '데이터 삭제 등 파괴적인 작업을 안내할 때 사용하는 AlertDialog 예시입니다.',
      },
    },
  },
  render: (args) => (
    <AlertDialog {...args}>
      <AlertDialogTrigger className="w-fit">
        <span>Delete Item</span>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this item?</AlertDialogTitle>
          <AlertDialogDescription>
            This action is permanent and cannot be undone. Please confirm that you want to proceed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogDestructive>Delete</AlertDialogDestructive>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
}
