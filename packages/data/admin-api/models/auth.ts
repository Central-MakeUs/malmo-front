export interface PostAuthReqDto {
  name: string
  password: string
  remember: boolean
}

export interface PostAuthResDto {
  id: number
  role: string
  name: string
  nickname: string
  expireDate: string
  enabled: boolean
  createdAt: string
  updatedAt: string
}
