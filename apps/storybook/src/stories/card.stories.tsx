import type { Meta, StoryObj } from '@storybook/react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@ui/common/components/card'

const meta = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '카드 컴포넌트는 콘텐츠를 구조화된 방식으로 표시하는데 사용됩니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: 'text',
      description: '카드의 자식 요소를 설정합니다.',
    },
    className: {
      control: 'text',
      description: '추가적인 CSS 클래스를 적용합니다.',
    },
  },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: (
      <>
        <CardHeader>
          <CardTitle>Default Card Title</CardTitle>
          <CardDescription>This is the description of the default card.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>This is some card content. You can add any text or other elements here.</p>
        </CardContent>
        <CardFooter>
          <p>Footer content goes here</p>
        </CardFooter>
      </>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: '기본 카드',
      },
    },
  },
}

export const WithHeaderAndContent: Story = {
  args: {
    children: (
      <>
        <CardHeader>
          <CardTitle>Card with Header</CardTitle>
          <CardDescription>Card description with additional content.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Here is more detailed content for the card.</p>
        </CardContent>
      </>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: '헤더 및 콘텐츠가 포함된 카드',
      },
    },
  },
}

// 푸터가 포함된 Card 스토리
export const WithFooter: Story = {
  args: {
    children: (
      <>
        <CardHeader>
          <CardTitle>Card with Footer</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Here is the main content for the card.</p>
        </CardContent>
        <CardFooter>
          <p>This is the footer section.</p>
        </CardFooter>
      </>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: '푸터가 포함된 카드',
      },
    },
  },
}

// 커스텀 스타일이 적용된 Card 스토리
export const CustomStyling: Story = {
  args: {
    children: (
      <>
        <CardHeader className="bg-blue-500 text-white">
          <CardTitle>Custom Styled Card</CardTitle>
          <CardDescription>This card has a custom header style.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>This card content also uses custom styling.</p>
        </CardContent>
        <CardFooter className="bg-gray-200">
          <p>Custom styled footer content.</p>
        </CardFooter>
      </>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: '커스텀 스타일이 적용된 카드',
      },
    },
  },
}
