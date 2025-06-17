import { http, HttpResponse } from 'msw'
import type {
  GetAdministratorResDto,
  GetAdministratorsResDto,
  IdParamsDto,
  PatchAdministratorReqDto,
  PostAdministratorReqDto,
} from '@data/admin-api/api'

const BASE_URL = 'https://admin'

// 가상 데이터베이스 역할을 하는 배열
let mockAdministrators: GetAdministratorResDto[] = [
  {
    id: 1,
    role: 'master',
    name: '최고관리자',
    nickname: 'AdminKing',
    memo: '시스템 총괄',
    expireDate: '2099-12-31',
    enabled: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    role: 'manager',
    name: '김매니저',
    nickname: 'ManagerKim',
    memo: '콘텐츠 관리',
    expireDate: '2025-12-31',
    enabled: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 3,
    role: 'manager',
    name: '이매니저',
    nickname: 'ManagerLee',
    memo: '회원 관리',
    expireDate: '2026-06-30',
    enabled: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export const administersHandlers = [
  // 관리자 리스트 조회
  http.get(`${BASE_URL}/administrators`, ({ request }) => {
    const url = new URL(request.url)
    const start = Number(url.searchParams.get('start') ?? '0')
    const perPage = Number(url.searchParams.get('perPage') ?? '10')

    const paginatedData = mockAdministrators.slice(start, start + perPage)

    return HttpResponse.json<GetAdministratorsResDto>({
      data: paginatedData,
      total: mockAdministrators.length,
    })
  }),

  // 관리자 리스트 상세 조회
  http.get(`${BASE_URL}/administrators/:id`, ({ params }) => {
    const { id } = params
    const admin = mockAdministrators.find((a) => a.id === Number(id))

    if (!admin) {
      return new HttpResponse(null, { status: 404, statusText: 'Not Found' })
    }

    return HttpResponse.json<GetAdministratorResDto>(admin)
  }),

  // 관리자 생성
  http.post(`${BASE_URL}/administrators`, async ({ request }) => {
    const newAdminData = (await request.json()) as PostAdministratorReqDto
    const newId = Math.max(...mockAdministrators.map((a) => a.id), 0) + 1

    const newAdmin: GetAdministratorResDto = {
      id: newId,
      ...newAdminData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    mockAdministrators.push(newAdmin)

    return HttpResponse.json<IdParamsDto>({ id: newId }, { status: 201 })
  }),

  // 관리자 수정
  http.patch(`${BASE_URL}/administrators/:id`, async ({ params, request }) => {
    const { id } = params
    const updates = (await request.json()) as PatchAdministratorReqDto

    const adminIndex = mockAdministrators.findIndex((a) => a.id === Number(id))

    if (adminIndex === -1) {
      return new HttpResponse(null, { status: 404, statusText: 'Not Found' })
    }

    mockAdministrators[adminIndex] = {
      ...mockAdministrators[adminIndex],
      ...updates,
      id: mockAdministrators[adminIndex]!.id,
      createdAt: mockAdministrators[adminIndex]!.createdAt,
      updatedAt: new Date().toISOString(),
    }

    return HttpResponse.json<IdParamsDto>({ id: Number(id) })
  }),

  // 관리자 삭제
  http.delete(`${BASE_URL}/administrators/:id`, ({ params }) => {
    const { id } = params
    const initialLength = mockAdministrators.length
    mockAdministrators = mockAdministrators.filter((a) => a.id !== Number(id))

    if (mockAdministrators.length === initialLength) {
      return new HttpResponse(null, { status: 404, statusText: 'Not Found' })
    }

    return new HttpResponse(null, { status: 204 })
  }),
]
