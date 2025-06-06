import type { Meta, StoryObj } from '@storybook/react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@ui/common/components/tabs'

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '탭 컴포넌트',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['underline', 'bordered', 'pill'],
      description: '탭 스타일 변형',
    },
    defaultValue: {
      control: 'text',
      description: '기본 선택 탭',
    },
  },
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof Tabs>

export const UnderlineStyle: Story = {
  render: () => (
    <Tabs defaultValue="tab1" className="w-[400px]">
      <TabsList className="w-full">
        <TabsTrigger value="tab1">전체</TabsTrigger>
        <TabsTrigger value="tab2">진행중</TabsTrigger>
        <TabsTrigger value="tab3">종료</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">전체 내용입니다.</TabsContent>
      <TabsContent value="tab2">진행중인 내용입니다.</TabsContent>
      <TabsContent value="tab3">종료된 내용입니다.</TabsContent>
    </Tabs>
  ),
}
UnderlineStyle.parameters = {
  docs: {
    description: {
      story: '기본 탭',
    },
  },
}

export const BorderedStyle: Story = {
  render: () => (
    <Tabs defaultValue="tab1" variant="bordered" className="w-[400px]">
      <TabsList className="w-full">
        <TabsTrigger value="tab1">할인</TabsTrigger>
        <TabsTrigger value="tab2">신상품</TabsTrigger>
        <TabsTrigger value="tab3">베스트</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">할인 상품 목록입니다.</TabsContent>
      <TabsContent value="tab2">신상품 목록입니다.</TabsContent>
      <TabsContent value="tab3">베스트 상품 목록입니다.</TabsContent>
    </Tabs>
  ),
}
BorderedStyle.parameters = {
  docs: {
    description: {
      story: '테두리 탭',
    },
  },
}

export const PillStyle: Story = {
  render: () => (
    <Tabs defaultValue="tab1" variant="pill" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="tab1">일간</TabsTrigger>
        <TabsTrigger value="tab2">주간</TabsTrigger>
        <TabsTrigger value="tab3">월간</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">일간 통계입니다.</TabsContent>
      <TabsContent value="tab2">주간 통계입니다.</TabsContent>
      <TabsContent value="tab3">월간 통계입니다.</TabsContent>
    </Tabs>
  ),
}
PillStyle.parameters = {
  docs: {
    description: {
      story: '피일 탭',
    },
  },
}

export const WithNumbers: Story = {
  render: () => (
    <Tabs defaultValue="tab1" className="w-[400px]">
      <TabsList className="w-full">
        <TabsTrigger value="tab1" showNumber number={150}>
          전체
        </TabsTrigger>
        <TabsTrigger value="tab2" showNumber number={42}>
          신규
        </TabsTrigger>
        <TabsTrigger value="tab3" showNumber number={108}>
          완료
        </TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">전체 목록입니다.</TabsContent>
      <TabsContent value="tab2">신규 목록입니다.</TabsContent>
      <TabsContent value="tab3">완료된 목록입니다.</TabsContent>
    </Tabs>
  ),
}
WithNumbers.parameters = {
  docs: {
    description: {
      story: '탭에 숫자 표시',
    },
  },
}

export const InCard: Story = {
  render: () => (
    <div className="w-[400px] rounded-lg border p-4">
      <Tabs defaultValue="tab1">
        <TabsList className="w-full">
          <TabsTrigger value="tab1">기본 정보</TabsTrigger>
          <TabsTrigger value="tab2">상세 정보</TabsTrigger>
          <TabsTrigger value="tab3">리뷰</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1" className="space-y-4">
          <h3 className="font-medium">기본 정보</h3>
          <p className="text-sm text-gray-500">상품의 기본 정보를 확인할 수 있습니다.</p>
        </TabsContent>
        <TabsContent value="tab2" className="space-y-4">
          <h3 className="font-medium">상세 정보</h3>
          <p className="text-sm text-gray-500">상품의 상세 정보를 확인할 수 있습니다.</p>
        </TabsContent>
        <TabsContent value="tab3" className="space-y-4">
          <h3 className="font-medium">리뷰</h3>
          <p className="text-sm text-gray-500">상품의 리뷰를 확인할 수 있습니다.</p>
        </TabsContent>
      </Tabs>
    </div>
  ),
}
InCard.parameters = {
  docs: {
    description: {
      story: '카드 내부에 탭 표시',
    },
  },
}

export const Disabled: Story = {
  render: () => (
    <Tabs defaultValue="tab1" className="w-[400px]">
      <TabsList className="w-full">
        <TabsTrigger value="tab1">활성화</TabsTrigger>
        <TabsTrigger value="tab2" disabled>
          비활성화
        </TabsTrigger>
        <TabsTrigger value="tab3">활성화</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">첫 번째 탭 내용입니다.</TabsContent>
      <TabsContent value="tab2">비활성화된 탭 내용입니다.</TabsContent>
      <TabsContent value="tab3">세 번째 탭 내용입니다.</TabsContent>
    </Tabs>
  ),
}
Disabled.parameters = {
  docs: {
    description: {
      story: '비활성화된 탭',
    },
  },
}
