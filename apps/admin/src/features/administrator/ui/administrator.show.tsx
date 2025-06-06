// import { Administrator } from '@/shared/services/administrator.service'
// import { formatDateTime } from '@data/utils/string'
// import { DataDescriptions } from '@ui/admin/components/data-descriptions'
// import { DataModalDescriptions } from '@ui/admin/components/data-modal'
// import * as React from 'react'

// export function AdministratorShow<T extends Administrator>({ record }: { record?: T }) {
//   const descriptions: DataModalDescriptions<T>[] = [
//     {
//       bordered: true,
//       items: [
//         {
//           accessorKey: 'id',
//           header: 'ID',
//         },
//         {
//           accessorKey: 'name',
//           header: '계정',
//         },
//         {
//           accessorKey: 'nickname',
//           header: '이름',
//           span: 2,
//         },
//         {
//           accessorKey: 'createdAt',
//           header: '생성일',
//           render: (value: string) => formatDateTime(value),
//         },
//         {
//           accessorKey: 'updatedAt',
//           header: '수정일',
//           render: (value: string) => formatDateTime(value),
//         },
//       ],
//     },
//   ]

//   return <DataDescriptions descriptions={descriptions} record={record}></DataDescriptions>
// }
