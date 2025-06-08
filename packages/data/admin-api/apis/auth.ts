import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { PostAuthReqDto, PostAuthResDto } from '../models/auth'

// GET /auth의 응답 타입. PostAuthResDto와 동일하다고 가정합니다.
export type GetAuthResDto = PostAuthResDto

// ===================================================
// 2. BaseAPI 클래스 정의
// 모든 API 클래스가 공통으로 사용할 axios 인스턴스를 주입받습니다.
// ===================================================

export class BaseAPI {
  protected axios: AxiosInstance
  protected basePath: string // 기본 경로 (필요시 사용)

  constructor(
    // configuration 객체는 자동생성 코드의 복잡한 설정들을 포함하지만,
    // 여기서는 간단히 무시하고 axios 인스턴스만 직접 받습니다.
    configuration: any,
    basePath: string,
    axios: AxiosInstance
  ) {
    this.axios = axios
    this.basePath = basePath || ''
  }
}

// ===================================================
// 3. AuthApi 클래스 정의 (핵심)
// 실제 API 엔드포인트를 호출하는 메서드들을 정의합니다.
// ===================================================

export class AuthApi extends BaseAPI {
  /**
   * @summary 로그인 세션 확인
   * @description 현재 쿠키/세션을 기반으로 로그인 상태를 확인합니다.
   * @method GET /admin/auth
   */
  public authControllerGetAuth(options?: AxiosRequestConfig): Promise<AxiosResponse<GetAuthResDto>> {
    const url = `/admin/auth`
    return this.axios.get<GetAuthResDto>(url, options)
  }

  /**
   * @summary 관리자 로그인
   * @description 이름과 비밀번호로 로그인하여 세션(쿠키)을 생성합니다.
   * @method POST /admin/auth
   * @param {PostAuthReqDto} data - 로그인에 필요한 데이터 (name, password)
   */
  public authControllerPostAuth(
    // 자동 생성된 코드는 requestParameters 객체로 한번 감싸지만,
    // 직접 만들 때는 DTO를 바로 받는 것이 더 직관적입니다.
    data: PostAuthReqDto,
    options?: AxiosRequestConfig
  ): Promise<AxiosResponse<PostAuthResDto>> {
    const url = `/admin/auth`
    return this.axios.post<PostAuthResDto>(url, data, options)
  }

  /**
   * @summary 로그아웃
   * @description 서버에서 현재 세션을 파기합니다.
   * @method DELETE /admin/auth
   */
  public authControllerLogout(options?: AxiosRequestConfig): Promise<AxiosResponse<void>> {
    const url = `/admin/auth`
    return this.axios.delete<void>(url, options)
  }

  /**
   * @summary 액세스 토큰 갱신 (Refresh Token)
   * @description 리프레시 토큰을 사용해 새로운 액세스 토큰을 발급받습니다.
   * @method POST /admin/auth/refresh-token
   */
  public authControllerPostRefresh(options?: AxiosRequestConfig): Promise<AxiosResponse<void>> {
    const url = `/admin/auth/refresh-token`
    return this.axios.post<void>(url, undefined, options) // body가 없는 POST 요청
  }
}
