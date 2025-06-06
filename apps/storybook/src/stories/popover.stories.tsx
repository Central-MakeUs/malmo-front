import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '@ui/common/components/button'
import { Popover, PopoverContent, PopoverTrigger } from '@ui/common/components/popover'

const meta = {
  title: 'Components/Popover',
  component: Popover,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Popover>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">팝오버 열기</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="leading-none font-medium">크기</h4>
            <p className="text-sm text-muted-foreground">원하는 크기를 설정하세요</p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
}

export const LeftAligned: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">왼쪽 정렬</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="leading-none font-medium">왼쪽 정렬된 팝오버</h4>
            <p className="text-sm text-muted-foreground">align=&quot;start&quot; 속성을 사용하여 왼쪽 정렬</p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
}

export const RightAligned: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">오른쪽 정렬</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="leading-none font-medium">오른쪽 정렬된 팝오버</h4>
            <p className="text-sm text-muted-foreground">align=&quot;end&quot; 속성을 사용하여 오른쪽 정렬</p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
}

export const WithOffset: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">오프셋 있는 팝오버</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" sideOffset={20}>
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="leading-none font-medium">오프셋이 있는 팝오버</h4>
            <p className="text-sm text-muted-foreground">sideOffset={20}을 사용하여 간격 조정</p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
}
