import type { Meta, StoryObj } from '@storybook/react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@ui/common/components/table'

const meta = {
  title: 'Components/Table',
  component: Table,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Table>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Table>
      <TableCaption>최근 거래 내역</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>거래일자</TableHead>
          <TableHead>거래내용</TableHead>
          <TableHead>금액</TableHead>
          <TableHead>잔액</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>2024-03-20</TableCell>
          <TableCell>식료품 구매</TableCell>
          <TableCell>-30,000원</TableCell>
          <TableCell>170,000원</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>2024-03-19</TableCell>
          <TableCell>급여입금</TableCell>
          <TableCell>+200,000원</TableCell>
          <TableCell>200,000원</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>총계</TableCell>
          <TableCell>170,000원</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
}

export const SimpleTable: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>이름</TableHead>
          <TableHead>이메일</TableHead>
          <TableHead>역할</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>홍길동</TableCell>
          <TableCell>hong@example.com</TableCell>
          <TableCell>관리자</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>김철수</TableCell>
          <TableCell>kim@example.com</TableCell>
          <TableCell>사용자</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
}
