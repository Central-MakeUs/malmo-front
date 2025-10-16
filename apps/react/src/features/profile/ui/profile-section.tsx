import { PartnerMemberDataMemberStateEnum } from '@data/user-api-axios/api'
import { Pen } from 'lucide-react'

import HeartIcon from '@/assets/icons/heart.svg'
import momoProfile from '@/assets/images/momo-profile.png'
import { AnniversaryEditSheet } from '@/features/anniversary'
import { usePartnerInfo } from '@/features/member'
import { wrapWithTracking } from '@/shared/analytics'
import { BUTTON_NAMES, CATEGORIES } from '@/shared/analytics/constants'
import { withParticle } from '@/shared/utils'

import { NicknameEditSheet } from './nickname-edit-sheet'
import { useProfileEdit } from '../hooks/use-profile-edit'

interface ProfileSectionProps {
  nickname: string
  dDay: number
}

export function ProfileSection({ nickname, dDay }: ProfileSectionProps) {
  // 커플 연동 상태
  const { data: partnerInfo } = usePartnerInfo()
  const isPartnerConnected = !!partnerInfo && partnerInfo.memberState === PartnerMemberDataMemberStateEnum.Alive

  const profileEdit = useProfileEdit()

  const handleProfileClick = wrapWithTracking(BUTTON_NAMES.OPEN_PROFILE_EDIT, CATEGORIES.PROFILE, () =>
    profileEdit.openNicknameSheet()
  )

  const handleAniversaryEdit = wrapWithTracking(BUTTON_NAMES.OPEN_ANNIVERSARY_SHEET, CATEGORIES.PROFILE, () =>
    profileEdit.openAnniversarySheet()
  )

  // 연인의 닉네임이 있으면 표시하고, 없으면 "연인" 표시
  const partnerName = partnerInfo?.nickname || '연인'
  const partnerDisplayText = withParticle(partnerName)

  return (
    <>
      <div className="pt-5">
        {/* 프로필 이미지 */}
        <div className="mx-[140px] flex justify-center">
          <img src={momoProfile} alt="프로필" className="h-24 w-24" />
        </div>

        {/* 닉네임 */}
        <div className="mt-3 flex justify-center">
          <div className="relative cursor-pointer" onClick={handleProfileClick}>
            <h2 className="heading1-bold text-center text-gray-iron-950">{nickname || '사용자'}</h2>
            <Pen className="absolute top-1/2 left-full ml-1 h-4 w-4 -translate-y-1/2 text-gray-iron-600" />
          </div>
        </div>

        {/* 연인과 D-day */}
        {isPartnerConnected && (
          <div className="mt-[18px] flex h-8 justify-center" onClick={handleAniversaryEdit}>
            <div className="flex items-center rounded-[30px] border border-gray-iron-200 px-4">
              <span className="body2-semibold text-gray-iron-950">{partnerDisplayText}</span>
              <HeartIcon className="mx-[9px] h-4 w-4" />
              <span className="body2-semibold text-gray-iron-950">D+{dDay}</span>
            </div>
          </div>
        )}
      </div>

      <AnniversaryEditSheet
        isOpen={profileEdit.isAnniversarySheetOpen}
        onOpenChange={profileEdit.setAnniversarySheetOpen}
        onSave={wrapWithTracking(BUTTON_NAMES.SAVE_ANNIVERSARY, CATEGORIES.PROFILE)}
      />

      <NicknameEditSheet
        isOpen={profileEdit.isNicknameSheetOpen}
        onOpenChange={profileEdit.setNicknameSheetOpen}
        onSave={wrapWithTracking(BUTTON_NAMES.SAVE_NICKNAME, CATEGORIES.PROFILE)}
      />
    </>
  )
}
