import { http, HttpResponse } from 'msw'
import type { GetAuthResDto } from '@data/admin-api/api'

interface PostAuthResDto {
  accessToken: string
  refreshToken: string
}

const BASE_URL = 'https://admin'

export const authHandlers = [
  // 로그인 세션 확인
  http.get(`${BASE_URL}/auth`, () => {
    return HttpResponse.json<GetAuthResDto>({
      id: 1,
      nickname: '관리자_닉네임',
    })
  }),

  // 관리자 로그인 (쿠키 설정)
  http.post(`${BASE_URL}/auth`, async () => {
    const accessToken = 'msw_mock_access_token_string'
    const refreshToken = 'msw_mock_refresh_token_string'

    const response = HttpResponse.json<PostAuthResDto>({
      accessToken,
      refreshToken,
    })

    // 응답 헤더에 Set-Cookie 추가
    response.headers.append(
      'Set-Cookie',
      `admin-access-token=${accessToken}; Path=/; Max-Age=3600; HttpOnly` // 1시간
    )
    response.headers.append(
      'Set-Cookie',
      `admin-refresh-token=${refreshToken}; Path=/; Max-Age=604800; HttpOnly` // 7일
    )

    return response
  }),

  // 로그아웃 (쿠키 삭제)
  http.delete(`${BASE_URL}/auth`, () => {
    const response = new HttpResponse(null, { status: 204 })

    // 쿠키의 Max-Age를 0으로 설정하여 즉시 만료(삭제)
    response.headers.append('Set-Cookie', 'admin-access-token=; Path=/; Max-Age=0')
    response.headers.append('Set-Cookie', 'admin-refresh-token=; Path=/; Max-Age=0')

    return response
  }),

  // Refresh Token
  http.post(`${BASE_URL}/auth/refresh-token`, () => {
    const newAccessToken = 'msw_mock_new_access_token_string'
    const response = new HttpResponse(null, { status: 200 })

    // 새로운 Access Token 쿠키 설정
    response.headers.append('Set-Cookie', `admin-access-token=${newAccessToken}; Path=/; Max-Age=3600; HttpOnly`)

    return response
  }),
]
