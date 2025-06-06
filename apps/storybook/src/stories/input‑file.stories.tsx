import type { Meta, StoryObj } from '@storybook/react'
import { InputFile } from '@ui/common/components/input-file'
import { useState } from 'react'

// 메타
const meta = {
  title: 'Input/InputFile',
  component: InputFile,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    mode: {
      control: 'select',
      options: ['square', 'inline', 'grid'],
      description: '표시 모드를 선택해 주세요.',
    },
    multiple: {
      control: 'boolean',
      description: '다중 선택 여부입니다.',
    },
    maxFiles: {
      control: { type: 'number', min: 1 },
      description: '최대 파일 개수입니다.',
    },
    maxSize: {
      control: { type: 'number', min: 1 },
      description: '최대 용량(MB)입니다.',
    },
    type: {
      control: 'select',
      options: ['all', 'image', 'file'],
      description: '허용 타입입니다.',
    },
    disabled: {
      control: 'boolean',
      description: '비활성화할지 선택해 주세요.',
    },
  },
} satisfies Meta<typeof InputFile>

export default meta

type Story = StoryObj<typeof meta>

// 업로드 모킹 함수
const mockUpload =
  (delay = 1500) =>
  async (file: File, onProgress: (p: number) => void) => {
    return new Promise<string>((resolve) => {
      let prog = 0
      const interval = setInterval(() => {
        prog += 10
        onProgress(prog)
        if (prog >= 100) {
          clearInterval(interval)
          // 임시 URL
          resolve(URL.createObjectURL(file))
        }
      }, delay / 10)
    })
  }

const Template = (args: any) => {
  const [value, setValue] = useState<string | string[] | undefined>(args.multiple ? [] : '')
  return <InputFile {...args} value={value} onChange={setValue as any} onUpload={mockUpload()} />
}

export const Square: Story = {
  args: {
    mode: 'square',
    multiple: false,
    maxFiles: 1,
    maxSize: 2,
    type: 'image',
    onUpload: mockUpload(),
  },
  render: Template,
  parameters: {
    docs: { description: { story: '기본 square 모드 예시입니다.' } },
  },
}

export const Inline: Story = {
  args: {
    mode: 'inline',
    multiple: true,
    maxFiles: 5,
    maxSize: 5,
    type: 'all',
    onUpload: mockUpload(),
  },
  render: Template,
  parameters: {
    docs: { description: { story: 'inline 모드 예시입니다.' } },
  },
}

export const Grid: Story = {
  args: {
    mode: 'grid',
    multiple: true,
    maxFiles: 3,
    maxSize: 10,
    type: 'file',
    preview: false,
    onUpload: mockUpload(),
  },
  render: Template,
  parameters: {
    docs: { description: { story: 'grid 모드 예시입니다.' } },
  },
}
