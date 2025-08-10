import { useNavigate } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'

import HeartIcon from '@/assets/icons/heart.svg'
import momoProfile from '@/assets/images/momo-profile.png'
import { usePartnerInfo } from '@/features/member'
import { withParticle } from '@/shared/utils'

interface ProfileSectionProps {
  nickname: string
  dDay: number
}

export function ProfileSection({ nickname, dDay }: ProfileSectionProps) {
  const navigate = useNavigate()
  const { data: partnerInfo } = usePartnerInfo()

  const handleProfileClick = () => {
    navigate({ to: '/my-page/profile' })
  }

  // 연인의 닉네임이 있으면 표시하고, 없으면 "연인" 표시
  const partnerName = partnerInfo?.nickname || '연인'
  const partnerDisplayText = withParticle(partnerName)

  return (
    <div className="pt-5">
      {/* 프로필 이미지 */}
      <div className="mx-[140px] flex justify-center">
        <img src={momoProfile} alt="프로필" className="h-24 w-24" />
      </div>

      {/* 닉네임 */}
      <div className="mt-3 flex justify-center">
        <div className="relative cursor-pointer" onClick={handleProfileClick}>
          <h2 className="heading1-bold text-center text-gray-iron-950">{nickname || '사용자'}</h2>
          <ChevronRight
            className="absolute top-1/2 ml-1 h-6 w-6 -translate-y-1/2 text-gray-iron-700"
            style={{ left: 'calc(100% + 4px)' }}
          />
        </div>
      </div>

      {/* 연인과 D-day */}
      <div className="mt-[18px] flex h-8 justify-center">
        <div className="flex items-center rounded-[30px] border border-gray-iron-200 px-4">
          <span className="body2-semibold text-gray-iron-950">{partnerDisplayText}</span>
          <HeartIcon className="mx-[9px] h-4 w-4" />
          <span className="body2-semibold text-gray-iron-950">D+{dDay}</span>
        </div>
      </div>
    </div>
  )
}
