import apiInstance from '../libs/api'
import {
  MemberData,
  MembersApi,
  UpdateMemberRequestDto,
  UpdateMemberTermsRequestDto,
  UpdateStartLoveDateRequestDto,
  LoveTypeTestResult,
} from '@data/user-api-axios/api'
import { queryKeys } from '../query-keys'
import { toast } from '../components/toast'

export const QUERY_KEY = 'members'

export interface Member extends MemberData {}

class MemberService extends MembersApi {
  constructor() {
    super(undefined, '', apiInstance)
  }

  // === Query Options ===
  userInfoQuery() {
    return {
      queryKey: queryKeys.member.userInfo(),
      queryFn: async () => {
        const { data } = await this.getMemberInfo()
        return data
      },
    }
  }

  inviteCodeQuery() {
    return {
      queryKey: queryKeys.member.inviteCode(),
      queryFn: async () => {
        const { data } = await this.getMemberInviteCode()
        return data
      },
    }
  }

  partnerInfoQuery() {
    return {
      queryKey: queryKeys.member.partnerInfo(),
      queryFn: async () => {
        const { data } = await this.getPartnerMemberInfo()
        return data
      },
    }
  }

  // === Mutation Options ===
  updateMemberMutation() {
    return {
      mutationFn: async (body: UpdateMemberRequestDto) => {
        const { data } = await this.updateMember({ updateMemberRequestDto: body })
        return data
      },
      onError: () => {
        toast.error('회원 정보 수정 중 오류가 발생했습니다')
      },
    }
  }

  updateStartDateMutation() {
    return {
      mutationFn: async (body: UpdateStartLoveDateRequestDto) => {
        const { data } = await this.updateStartLoveDate({ updateStartLoveDateRequestDto: body })
        return data
      },
      onError: () => {
        toast.error('연애 시작일 수정 중 오류가 발생했습니다')
      },
    }
  }

  updateTermsMutation() {
    return {
      mutationFn: async (body: UpdateMemberTermsRequestDto) => {
        const { data } = await this.updateMemberTerms({
          updateMemberTermsRequestDto: body,
        })
        return data
      },
      onError: () => {
        toast.error('약관 동의 처리 중 오류가 발생했습니다')
      },
    }
  }

  deleteMemberMutation() {
    return {
      mutationFn: async () => {
        const { data } = await this.deleteMember({})
        return data
      },
      onError: () => {
        toast.error('회원 탈퇴 중 오류가 발생했습니다')
      },
    }
  }

  submitLoveTypeTestMutation() {
    return {
      mutationFn: async (results: LoveTypeTestResult[]) => {
        const { data } = await this.registerLoveType({
          registerLoveTypeRequestDto: { results },
        })
        return data
      },
      onError: () => {
        toast.error('애착유형 검사 제출 중 오류가 발생했습니다')
      },
    }
  }
}

export default new MemberService()
