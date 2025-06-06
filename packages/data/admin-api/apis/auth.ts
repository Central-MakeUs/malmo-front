// packages/data/admin-api/src/api/index.ts
import type { AxiosInstance } from 'axios'

/* ================================
 * DTO 정의
 * ============================== */
export interface PostAuthReqDto {
  name: string
  password: string
  remember: boolean
}

export interface AuthInfoResDto {
  id: number
  name: string
  roles: string[]
}

export interface AuthLoginResDto {
  token: string
  expiresIn: number // seconds
  name: string
}

/* ================================
 * 공통 응답 래퍼(선택)
 * ============================== */
export type ApiResponse<T> = {
  data: T
}

/* ================================
 * AuthApi
 * ============================== */
export class AuthApi {
  /**
   * @param _unused   ― OpenAPI generator와 시그니처를 맞추기 위한 자리값
   * @param baseURL   ― 엔드포인트 베이스 URL(`/api` 등)
   * @param axios     ― 주입받을 Axios 인스턴스
   */
  constructor(
    _unused: unknown = undefined,
    private readonly baseURL = '',
    protected readonly axios: AxiosInstance
  ) {}

  /** GET /auth ― 현재 로그인 정보를 조회 */
  async authControllerGetAuth() {
    return this.axios.get<AuthInfoResDto>(`${this.baseURL}/auth`)
  }

  /** POST /auth ― 로그인 */
  async authControllerPostAuth(args: { postAuthReqDto: PostAuthReqDto }) {
    return this.axios.post<AuthLoginResDto>(`${this.baseURL}/auth`, args.postAuthReqDto)
  }
}
