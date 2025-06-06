import type { Meta, StoryObj } from '@storybook/react'
import { AlertDialogProvider, GlobalAlertDialog } from '@ui/common/components/global-alert-dialog'
import { useAlertDialog } from '@ui/common/hooks/alert-dialog.hook'

const meta = {
  title: 'Modal/GlobalAlertDialog',
  component: GlobalAlertDialog,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof GlobalAlertDialog>

export default meta

type Story = StoryObj<typeof meta>

const Template = (args: any, destructive = false) => {
  const Demo = () => {
    const { open } = useAlertDialog()
    return (
      <button
        className="rounded border px-3 py-1 text-sm"
        onClick={() =>
          open({
            title: '확인',
            description: '정말 진행하시겠습니까?',
            cancelText: '취소',
            confirmText: destructive ? '삭제' : '확인',
            destructive,
          })
        }
      >
        다이얼로그 열기
      </button>
    )
  }
  return (
    <AlertDialogProvider>
      <Demo />
    </AlertDialogProvider>
  )
}

export const Default: Story = {
  render: (args) => Template(args, false),
  parameters: {
    docs: {
      description: { story: '일반 확인용 다이얼로그 예시입니다.' },
    },
  },
}

export const Destructive: Story = {
  render: (args) => Template(args, true),
  parameters: {
    docs: {
      description: { story: '파괴적 작업에 사용하는 다이얼로그 예시입니다.' },
    },
  },
}
