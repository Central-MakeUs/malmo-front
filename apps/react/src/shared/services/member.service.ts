import {
  MemberData,
  MembersApi,
  UpdateMemberRequestDto,
  UpdateMemberTermsRequestDto,
  UpdateStartLoveDateRequestDto,
  LoveTypeTestResult,
  CreatePartnerProfileRequestDto,
  UpdatePartnerProfileRequestDto,
} from '@data/user-api-axios/api'

import { queryKeys } from './query-keys'
import apiInstance from '../lib/api'
import { toast } from '../ui/toast'

export const QUERY_KEY = 'members'

export interface Member extends MemberData {}

class MemberService extends MembersApi {
  constructor() {
    super(undefined, '', apiInstance)
  }

  // === Query Options ===
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
      throwOnError: (error: any) => {
        // axios 에러와 일반 에러 구조 모두 고려
        const status = error?.response?.status
        const errorCode = error?.response?.data?.code
        // 40301: 파트너 없음 (403), 400: 온보딩 직후 파트너 미연결 상태
        return errorCode !== 40301 && status !== 400
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
      onSuccess: () => {
        toast.success('닉네임이 변경되었어요!')
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
      onSuccess: () => {
        toast.success('디데이가 변경되었어요!')
      },
      onError: () => {
        toast.error('디데이 수정 중 오류가 발생했습니다')
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

  createPartnerProfileMutation() {
    return {
      mutationFn: async (body: CreatePartnerProfileRequestDto) => {
        const { data } = await this.createPartnerProfile({ createPartnerProfileRequestDto: body })
        return data
      },
      onError: () => {
        toast.error('상대 프로필 등록 중 오류가 발생했습니다')
      },
    }
  }

  updatePartnerProfileMutation() {
    return {
      mutationFn: async (body: UpdatePartnerProfileRequestDto) => {
        const { data } = await this.updatePartnerProfile({ updatePartnerProfileRequestDto: body })
        return data
      },
      onError: () => {
        toast.error('상대 프로필 수정 중 오류가 발생했습니다')
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
