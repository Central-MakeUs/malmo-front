import type { Meta, StoryObj } from '@storybook/react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from '@ui/common/components/sidebar'
import { Folder, Home, Settings, User } from 'lucide-react'

const meta = {
  title: 'Layout/Sidebar',
  component: Sidebar,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  argTypes: {
    collapsible: {
      control: 'select',
      options: ['offcanvas', 'icon', 'none'],
      description: '사이드바 접힘 방식을 선택해 주세요.',
    },
    variant: {
      control: 'select',
      options: ['sidebar', 'floating', 'inset'],
      description: '사이드바 형태를 선택해 주세요.',
    },
    side: {
      control: 'select',
      options: ['left', 'right'],
      description: '사이드 위치를 선택해 주세요.',
    },
  },
} satisfies Meta<typeof Sidebar>

export default meta

type Story = StoryObj<typeof meta>

const Template = (args: any) => (
  <SidebarProvider>
    <SidebarTrigger className="fixed top-2 left-2 z-50" />
    <Sidebar {...args} className="border-r">
      <SidebarHeader>
        <h1 className="text-lg font-bold">로고</h1>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>메뉴</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton isActive tooltip="홈">
                <Home /> <span>홈</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="프로필">
                <User /> <span>프로필</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="설정">
                <Settings /> <span>설정</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="파일">
                <Folder /> <span>파일</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
    <SidebarInset className="p-4">
      <div className="prose" style={{ marginTop: 'calc(4rem + 1rem)' }}>
        <h2>메인 콘텐츠</h2>
        <p>사이드바 토글 버튼(⌘/Ctrl + b)으로 열고 닫을 수 있습니다.</p>
      </div>
    </SidebarInset>
  </SidebarProvider>
)

export const Default: Story = {
  args: {
    collapsible: 'offcanvas',
    variant: 'sidebar',
    side: 'left',
  },
  render: Template,
  parameters: {
    docs: { description: { story: '기본 사이드바 예시입니다.' } },
  },
}
