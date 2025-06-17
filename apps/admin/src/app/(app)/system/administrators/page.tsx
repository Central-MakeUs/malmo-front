import { AdministratorModal } from '@/features/administrator/ui'
import administratorService, { Administrator } from '@/shared/services/administrator.service'
import { usePageFilters } from '@/widgets/page/hooks'
import { pageSearchSchema } from '@/widgets/page/ui'
import { formatDateTime } from '@data/utils/string'
import { createFileRoute } from '@tanstack/react-router'
import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@ui/admin/components/data-table'
import { Button } from '@ui/common/components/button'
import { PlusCircle } from 'lucide-react'
import * as React from 'react'
import { z } from 'zod'

const searchSchema = pageSearchSchema.extend({
  search: z.string().optional(),
  sort: z.string().optional(),
  id: z.number().optional(),
})

export const Route = createFileRoute('/(app)/system/administrators/')({
  component: AdministratorsPage,
  validateSearch: searchSchema,
  loaderDeps: (search) => search,
  loader: async ({ context, deps }) => {
    return {
      data: await administratorService.findAll(deps.search),
    }
  },
})

function AdministratorsPage() {
  const { data } = Route.useLoaderData()
  const pageFilters = usePageFilters(Route.id)

  const columns: ColumnDef<Administrator>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
    },
    {
      accessorKey: 'name',
      header: '계정',
      enableSorting: true,
    },
    {
      accessorKey: 'nickname',
      header: '이름',
    },
    {
      accessorKey: 'createdAt',
      header: '생성일',
      cell: ({ row }) => formatDateTime(row.original.createdAt),
    },
    {
      accessorKey: 'updatedAt',
      header: '수정일',
      cell: ({ row }) => formatDateTime(row.original.updatedAt),
    },
  ]

  async function handleRowClick(record: Administrator) {
    await pageFilters.navigate({ modalAction: 'show', id: record.id })
  }

  async function handleCreate() {
    await pageFilters.navigate({ modalAction: 'create' })
  }

  return (
    <>
      <div className="p-2">
        <DataTable
          data={data?.data}
          total={data?.total}
          columns={columns}
          pagination={pageFilters.pagination}
          sorting={pageFilters.sorting}
          onTableChange={(search) => pageFilters.navigate(search)}
          onRow={handleRowClick}
          selectedEnabled
          toolbar={{
            viewOptionsEnabled: true,
            topRightItems: [
              <Button key="add" size="sm" onClick={handleCreate}>
                <PlusCircle />
                <span className="hidden sm:inline">추가</span>
              </Button>,
            ],
            filter: {
              query: pageFilters.getQuery(),
              searchKey: 'search',
              items: [
                {
                  accessorKey: 'filter',
                  multiple: true,
                  title: '필터',
                  options: [
                    { label: '홍', value: 'hong' },
                    { label: '마커스', value: 'asds' },
                  ],
                },
                {
                  accessorKey: 'nickname',
                  title: '이름',
                  options: [
                    { label: '홍', value: 'hong' },
                    { label: '마커스', value: 'asds' },
                  ],
                },
              ],
            },
          }}
        />
      </div>
      <AdministratorModal
        open={!!pageFilters.filters.modalAction}
        id={pageFilters.filters.id}
        type={pageFilters.filters.modalAction}
        record={data?.data.find((d) => d.id === pageFilters.filters.id)}
        onChangeType={(type) => pageFilters.navigate({ modalAction: type })}
        onClose={() =>
          pageFilters.navigate({
            id: undefined,
            modalAction: undefined,
          })
        }
      />
    </>
  )
}
