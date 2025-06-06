import type { Meta, StoryObj } from '@storybook/react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@ui/common/components/accordion'

const meta = {
  title: 'Components/Accordion',
  component: Accordion,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['single', 'multiple'],
      description:
        '아코디언의 동작 방식을 설정합니다. single은 하나만 열리고, multiple은 여러 개를 동시에 열 수 있습니다.',
    },
    defaultValue: {
      control: { type: 'text' },
      description:
        'single 타입일 경우 문자열, multiple 타입일 경우 문자열 배열로 기본적으로 열려있을 아이템을 지정합니다.',
    },
    collapsible: {
      control: 'boolean',
      description: '열린 항목을 다시 클릭하여 닫을 수 있는지 여부를 설정합니다.',
    },
    className: {
      control: 'text',
      description: '추가적인 CSS 클래스를 적용합니다.',
    },
  },
} satisfies Meta<typeof Accordion>

export default meta
type Story = StoryObj<typeof meta>

// 기본 Accordion 스토리
export const Default: Story = {
  args: {
    type: 'single',
    defaultValue: 'item-1',
  },
  parameters: {
    docs: {
      description: {
        story: '기본 단일 아코디언',
      },
    },
  },
  render: (args) => (
    <Accordion {...args}>
      <AccordionItem value="item-1">
        <AccordionTrigger>Section 1</AccordionTrigger>
        <AccordionContent>This is the content for Section 1.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Section 2</AccordionTrigger>
        <AccordionContent>This is the content for Section 2.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Section 3</AccordionTrigger>
        <AccordionContent>This is the content for Section 3.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
}

// 다중 열림 가능한 Accordion
export const Multiple: Story = {
  args: {
    type: 'multiple',
    defaultValue: ['item-1', 'item-3'],
  },
  parameters: {
    docs: {
      description: {
        story: '다중 열림 가능한 Accordion',
      },
    },
  },
  render: (args) => (
    <Accordion {...args}>
      <AccordionItem value="item-1">
        <AccordionTrigger>Section 1</AccordionTrigger>
        <AccordionContent>This is the content for Section 1.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Section 2</AccordionTrigger>
        <AccordionContent>This is the content for Section 2.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Section 3</AccordionTrigger>
        <AccordionContent>This is the content for Section 3.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
}

// 추가적인 크기 조정 또는 스타일링을 필요로 하는 경우
export const CustomStyling: Story = {
  args: {
    type: 'single',
    defaultValue: 'item-1',
  },
  parameters: {
    docs: {
      description: {
        story: '추가적인 크기 조정 또는 스타일링을 필요로 하는 경우',
      },
    },
  },
  render: (args) => (
    <Accordion {...args}>
      <AccordionItem value="item-1">
        <AccordionTrigger className="text-red-500">Styled Section 1</AccordionTrigger>
        <AccordionContent className="text-blue-500">This section has custom styles applied.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Section 2</AccordionTrigger>
        <AccordionContent>This is the content for Section 2.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
}
