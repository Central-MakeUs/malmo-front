import { Pen } from 'lucide-react'

import momoProfile from '@/assets/images/momo-profile.png'
import { wrapWithTracking } from '@/shared/analytics'
import { BUTTON_NAMES, CATEGORIES } from '@/shared/analytics/constants'

import { NicknameEditSheet } from './nickname-edit-sheet'
import { useProfileEdit } from '../hooks/use-profile-edit'

interface ProfileSectionProps {
  nickname: string
}

export function ProfileSection({ nickname }: ProfileSectionProps) {
  const profileEdit = useProfileEdit()

  const handleProfileClick = wrapWithTracking(BUTTON_NAMES.OPEN_PROFILE_EDIT, CATEGORIES.PROFILE, () =>
    profileEdit.openNicknameSheet()
  )

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
      </div>

      <NicknameEditSheet
        isOpen={profileEdit.isNicknameSheetOpen}
        onOpenChange={profileEdit.setNicknameSheetOpen}
        onSave={wrapWithTracking(BUTTON_NAMES.SAVE_NICKNAME, CATEGORIES.PROFILE)}
      />
    </>
  )
}
