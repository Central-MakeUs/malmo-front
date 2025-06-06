import type { Meta, StoryObj } from '@storybook/react'
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@ui/common/components/breadcrumb'

const meta = {
  title: 'Layout/Breadcrumb',
  component: Breadcrumb,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    className: { control: 'text', description: '추가 클래스를 설정합니다.' },
  },
} satisfies Meta<typeof Breadcrumb>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: '기본 브레드크럼브 예시입니다.',
      },
    },
  },
  render: (args) => (
    <Breadcrumb {...args}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">홈</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="#">라이브러리</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>데이터</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
}

export const WithEllipsis: Story = {
  parameters: {
    docs: {
      description: {
        story: '여러 항목이 있는 경우의 예시입니다.',
      },
    },
  },
  render: (args) => (
    <Breadcrumb {...args}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">홈</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="#">카테고리</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="#">서브카테고리</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbEllipsis />
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>현재 페이지</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
}
