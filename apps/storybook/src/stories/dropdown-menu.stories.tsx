import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '@ui/common/components/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@ui/common/components/dropdown-menu'

import { useState } from 'react'

const meta = {
  title: 'Components/DropdownMenu',
  component: DropdownMenu,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '드롭다운 메뉴를 표시하는 컴포넌트입니다.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DropdownMenu>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>메뉴 열기</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>프로필 보기</DropdownMenuItem>
        <DropdownMenuItem>설정</DropdownMenuItem>
        <DropdownMenuItem>로그아웃</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
  parameters: {
    docs: {
      description: {
        story: '기본적인 드롭다운 메뉴 예시입니다.',
      },
    },
  },
}

export const WithCheckbox: Story = {
  render: () => {
    const [showStatus, setShowStatus] = useState(true)
    const [showActivity, setShowActivity] = useState(false)

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>표시 설정</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuCheckboxItem checked={showStatus} onCheckedChange={setShowStatus}>
            상태 표시
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked={showActivity} onCheckedChange={setShowActivity}>
            활동 표시
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  },
  parameters: {
    docs: {
      description: {
        story: '체크박스를 포함한 드롭다운 메뉴 예시입니다.',
      },
    },
  },
}

export const WithRadioGroup: Story = {
  render: () => {
    const [position, setPosition] = useState('bottom')

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>위치 설정</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
            <DropdownMenuRadioItem value="top">상단</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="bottom">하단</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="right">우측</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  },
  parameters: {
    docs: {
      description: {
        story: '라디오 그룹을 포함한 드롭다운 메뉴 예시입니다.',
      },
    },
  },
}

export const WithSubMenu: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>더보기</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>계정</DropdownMenuLabel>
        <DropdownMenuItem>프로필</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>설정</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>알림 설정</DropdownMenuItem>
            <DropdownMenuItem>테마 설정</DropdownMenuItem>
            <DropdownMenuItem>언어 설정</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem>로그아웃</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
  parameters: {
    docs: {
      description: {
        story: '서브 메뉴를 포함한 드롭다운 메뉴 예시입니다.',
      },
    },
  },
}

export const WithShortcuts: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>편집</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          복사하기
          <DropdownMenuShortcut>⌘C</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          붙여넣기
          <DropdownMenuShortcut>⌘V</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          잘라내기
          <DropdownMenuShortcut>⌘X</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
  parameters: {
    docs: {
      description: {
        story: '단축키를 포함한 드롭다운 메뉴 예시입니다.',
      },
    },
  },
}

export const Disabled: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>작업</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>편집</DropdownMenuItem>
        <DropdownMenuItem disabled>삭제</DropdownMenuItem>
        <DropdownMenuItem disabled>이동</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
  parameters: {
    docs: {
      description: {
        story: '비활성화된 메뉴 아이템을 포함한 드롭다운 메뉴 예시입니다.',
      },
    },
  },
}
