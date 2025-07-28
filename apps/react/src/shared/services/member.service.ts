import { queryOptions } from '@tanstack/react-query'
import apiInstance from '../libs/api'
import {
  MemberData,
  MembersApi,
  RegisterLoveTypeRequestDto,
  UpdateMemberRequestDto,
  UpdateMemberTermsRequestDto,
  UpdateStartLoveDateRequestDto,
  LoveTypeTestResult,
} from '@data/user-api-axios/api'

export const QUERY_KEY = 'members'

export interface Member extends MemberData {}

class MemberService extends MembersApi {
  constructor() {
    super(undefined, '', apiInstance)
  }

  async findOne() {
    const { data } = await this.getMemberInfo()
    return data
  }

  async inviteCode() {
    const { data } = await this.getMemberInviteCode()
    return data
  }

  async partner() {
    const { data } = await this.getPartnerMemberInfo()
    return data
  }

  async update(body: UpdateMemberRequestDto) {
    const { data } = await this.updateMember({ updateMemberRequestDto: body })
    return { data }
  }

  async updateStartDate(body: UpdateStartLoveDateRequestDto) {
    const { data } = await this.updateStartLoveDate({ updateStartLoveDateRequestDto: body })
    return { data }
  }

  async terms(body: UpdateMemberTermsRequestDto) {
    const { data } = await this.updateMemberTerms({
      updateMemberTermsRequestDto: body,
    })
    return data
  }

  async delete() {
    const { data } = await this.deleteMember({})
    return data
  }

  async submitLoveTypeTest(results: LoveTypeTestResult[]) {
    const { data } = await this.registerLoveType({
      registerLoveTypeRequestDto: { results },
    })
    return data
  }

  findOneQuery(params: { id?: number }) {
    return queryOptions({
      queryKey: [QUERY_KEY, params],
      queryFn: () => {
        if (params.id) {
          return this.findOne()
        }
        throw new Error('id is required')
      },
    })
  }
}

export default new MemberService()
